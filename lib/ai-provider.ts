import { generateText, generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export interface ProviderConfig {
  name: 'anthropic' | 'openai';
  provider: any;
  models: {
    fast: string; // For quick, simple tasks
    smart: string; // For complex, high-quality tasks
    balanced: string; // For general use
  };
  isAvailable: boolean;
  lastChecked: number;
  errorCount: number;
  maxErrors: number;
}

export interface ProviderHealthStatus {
  name: string;
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  lastChecked: Date;
}

// Provider configurations with model mappings
const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    name: 'anthropic',
    provider: anthropic,
    models: {
      fast: 'claude-3-5-haiku-latest',
      smart: 'claude-3-5-sonnet-latest', 
      balanced: 'claude-3-5-sonnet-latest'
    },
    isAvailable: true,
    lastChecked: 0,
    errorCount: 0,
    maxErrors: 3
  },
  {
    name: 'openai',
    provider: openai,
    models: {
      fast: 'gpt-4o-mini',
      smart: 'gpt-4o',
      balanced: 'gpt-4o-mini'
    },
    isAvailable: true,
    lastChecked: 0,
    errorCount: 0,
    maxErrors: 3
  }
];

// Cache for health checks (5 minutes)
const HEALTH_CACHE_DURATION = 5 * 60 * 1000;
const healthCache = new Map<string, ProviderHealthStatus>();

/**
 * Check if required environment variables are set for a provider
 */
function hasRequiredApiKeys(providerName: string): boolean {
  switch (providerName) {
    case 'anthropic':
      return !!(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'sk-ant-...');
    case 'openai':
      return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));
    default:
      return false;
  }
}

/**
 * Perform a lightweight health check on a provider
 */
async function checkProviderHealth(config: ProviderConfig): Promise<ProviderHealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if API keys are configured
    if (!hasRequiredApiKeys(config.name)) {
      return {
        name: config.name,
        isHealthy: false,
        error: `API key not configured for ${config.name}`,
        lastChecked: new Date()
      };
    }

    // Perform a minimal API call to check health
    const testModel = config.provider(config.models.fast);
    
    await generateText({
      model: testModel,
      prompt: 'Test', // Minimal prompt
      temperature: 0
    });

    const responseTime = Date.now() - startTime;
    
    return {
      name: config.name,
      isHealthy: true,
      responseTime,
      lastChecked: new Date()
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      name: config.name,
      isHealthy: false,
      responseTime,
      error: error.message || 'Unknown error',
      lastChecked: new Date()
    };
  }
}

/**
 * Get cached health status or perform new check
 */
async function getProviderHealthStatus(config: ProviderConfig): Promise<ProviderHealthStatus> {
  const cacheKey = config.name;
  const cached = healthCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.lastChecked.getTime()) < HEALTH_CACHE_DURATION) {
    return cached;
  }

  const status = await checkProviderHealth(config);
  healthCache.set(cacheKey, status);
  
  // Update provider availability
  config.isAvailable = status.isHealthy;
  config.lastChecked = Date.now();
  
  if (!status.isHealthy) {
    config.errorCount++;
  } else {
    config.errorCount = 0; // Reset error count on success
  }
  
  return status;
}

/**
 * Get the best available provider for a given task complexity
 */
export async function getBestProvider(
  complexity: 'fast' | 'smart' | 'balanced' = 'balanced',
  preferredProvider?: 'anthropic' | 'openai'
): Promise<{ provider: any; model: any; providerName: string } | null> {
  
  // Sort providers by preference and availability
  let sortedConfigs = [...PROVIDER_CONFIGS];
  
  if (preferredProvider) {
    sortedConfigs = sortedConfigs.sort((a, b) => {
      if (a.name === preferredProvider) return -1;
      if (b.name === preferredProvider) return 1;
      return 0;
    });
  }

  // Try each provider in order
  for (const config of sortedConfigs) {
    try {
      // Skip if provider has exceeded max errors
      if (config.errorCount >= config.maxErrors) {
        console.warn(`Provider ${config.name} disabled due to too many errors (${config.errorCount})`);
        continue;
      }

      const healthStatus = await getProviderHealthStatus(config);
      
      if (healthStatus.isHealthy) {
        const model = config.provider(config.models[complexity]);
        
        return {
          provider: config.provider,
          model,
          providerName: config.name
        };
      } else {
        console.warn(`Provider ${config.name} is unhealthy: ${healthStatus.error}`);
      }
    } catch (error) {
      console.error(`Error checking provider ${config.name}:`, error);
      config.errorCount++;
    }
  }

  return null;
}

/**
 * Generate text with automatic provider fallback
 */
export async function generateTextWithFallback(
  options: {
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    complexity?: 'fast' | 'smart' | 'balanced';
    preferredProvider?: 'anthropic' | 'openai';
  }
): Promise<{ text: string; provider: string }> {
  
  const { complexity = 'balanced', preferredProvider, ...generateOptions } = options;
  
  const providerInfo = await getBestProvider(complexity, preferredProvider);
  
  if (!providerInfo) {
    throw new Error('No available AI providers. Please check your API keys and internet connection.');
  }

  try {
    const result = await generateText({
      model: providerInfo.model,
      ...generateOptions
    });

    return {
      text: result.text,
      provider: providerInfo.providerName
    };
  } catch (error) {
    console.error(`Error with ${providerInfo.providerName}:`, error);
    
    // Mark provider as having an error
    const config = PROVIDER_CONFIGS.find(c => c.name === providerInfo.providerName);
    if (config) {
      config.errorCount++;
      config.isAvailable = false;
    }

    // Try with a different provider
    const fallbackProvider = await getBestProvider(complexity, 
      providerInfo.providerName === 'anthropic' ? 'openai' : 'anthropic'
    );
    
    if (!fallbackProvider) {
      throw new Error('All AI providers are currently unavailable. Please try again later.');
    }

    console.log(`Falling back to ${fallbackProvider.providerName}`);
    
    const fallbackResult = await generateText({
      model: fallbackProvider.model,
      ...generateOptions
    });

    return {
      text: fallbackResult.text,
      provider: fallbackProvider.providerName
    };
  }
}

/**
 * Generate object with automatic provider fallback
 */
export async function generateObjectWithFallback<T>(
  options: {
    prompt: string;
    system?: string;
    schema: any;
    temperature?: number;
    complexity?: 'fast' | 'smart' | 'balanced';
    preferredProvider?: 'anthropic' | 'openai';
  }
): Promise<{ object: T; provider: string }> {
  
  const { complexity = 'balanced', preferredProvider, ...generateOptions } = options;
  
  const providerInfo = await getBestProvider(complexity, preferredProvider);
  
  if (!providerInfo) {
    throw new Error('No available AI providers. Please check your API keys and internet connection.');
  }

  try {
    const result = await generateObject({
      model: providerInfo.model,
      ...generateOptions
    });

    return {
      object: result.object as T,
      provider: providerInfo.providerName
    };
  } catch (error) {
    console.error(`Error with ${providerInfo.providerName}:`, error);
    
    // Mark provider as having an error
    const config = PROVIDER_CONFIGS.find(c => c.name === providerInfo.providerName);
    if (config) {
      config.errorCount++;
      config.isAvailable = false;
    }

    // Try with a different provider
    const fallbackProvider = await getBestProvider(complexity, 
      providerInfo.providerName === 'anthropic' ? 'openai' : 'anthropic'
    );
    
    if (!fallbackProvider) {
      throw new Error('All AI providers are currently unavailable. Please try again later.');
    }

    console.log(`Falling back to ${fallbackProvider.providerName}`);
    
    const fallbackResult = await generateObject({
      model: fallbackProvider.model,
      ...generateOptions
    });

    return {
      object: fallbackResult.object as T,
      provider: fallbackProvider.providerName
    };
  }
}

/**
 * Get health status of all providers
 */
export async function getAllProvidersHealth(): Promise<ProviderHealthStatus[]> {
  const healthPromises = PROVIDER_CONFIGS.map(config => getProviderHealthStatus(config));
  return Promise.all(healthPromises);
}

/**
 * Reset error counts for all providers (useful for recovery)
 */
export function resetProviderErrors(): void {
  PROVIDER_CONFIGS.forEach(config => {
    config.errorCount = 0;
    config.isAvailable = true;
  });
  healthCache.clear();
}

/**
 * Get provider statistics
 */
export function getProviderStats() {
  return PROVIDER_CONFIGS.map(config => ({
    name: config.name,
    isAvailable: config.isAvailable,
    errorCount: config.errorCount,
    maxErrors: config.maxErrors,
    hasApiKey: hasRequiredApiKeys(config.name),
    lastChecked: new Date(config.lastChecked)
  }));
}
