const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // List all users first
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\n📋 Current Users:');
    console.log('=================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} ${user.isAdmin ? '👑 (Admin)' : ''}`);
      console.log(`   Name: ${user.name || 'Not set'}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Get email from command line argument or ask for input
    const email = process.argv[2];
    
    if (!email) {
      console.log('💡 Usage: node scripts/setup-admin.js <email>');
      console.log('Example: node scripts/setup-admin.js your-email@example.com');
      console.log('\nOr choose from the list above and run again with the email.');
      return;
    }

    // Find user and make them admin
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`❌ User with email ${email} not found.`);
      console.log('Please make sure the email is correct or create an account first.');
      return;
    }

    if (user.isAdmin) {
      console.log(`✅ ${email} is already an admin!`);
      return;
    }

    // Update user to admin
    await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    });

    // Log the admin creation
    await prisma.systemLogs.create({
      data: {
        level: 'info',
        service: 'admin',
        message: `Admin privileges granted to ${email}`,
        details: {
          userId: user.id,
          email: email,
          grantedAt: new Date().toISOString()
        }
      }
    });

    console.log(`🎉 Successfully granted admin privileges to ${email}!`);
    console.log('You can now access the admin dashboard at /admin');

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
