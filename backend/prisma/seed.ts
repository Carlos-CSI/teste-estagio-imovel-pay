import { PrismaClient, ChargeStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate a valid CPF
function generateCPF(): string {
  const random = (n: number) => Math.floor(Math.random() * n);
  
  // Generate 9 base digits
  const base = Array.from({ length: 9 }, () => random(10));
  
  // Calculate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += base[i] * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  digit1 = digit1 > 9 ? 0 : digit1;
  
  // Calculate second check digit
  sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += base[i] * (11 - i);
  }
  sum += digit1 * 2;
  let digit2 = 11 - (sum % 11);
  digit2 = digit2 > 9 ? 0 : digit2;
  
  return [...base, digit1, digit2].join('');
}

// Generate a random date between two periods
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const firstNames = [
  'Christian', 'Maria', 'João', 'Ana', 'Pedro', 'Carla', 'Lucas', 
  'Fernanda', 'Rafael', 'Juliana', 'Bruno', 'Camila', 'Gabriel',
  'Patricia', 'Felipe', 'Mariana', 'Diego', 'Amanda', 'Thiago', 'Beatriz'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues',
  'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Ribeiro', 'Carvalho', 'Martins',
  'Pereira', 'Gomes', 'Barbosa', 'Rocha', 'Dias', 'Monteiro'
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.customer.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create 20 customers
  const customers = [];
  for (let i = 0; i < 20; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: `${firstNames[i]} ${lastNames[i]}`,
        cpf: generateCPF(),
      },
    });
    customers.push(customer);
  }

  console.log('✅ Created 20 customers');

  // Status distribution: 147 PAGO, 262 PENDENTE, 7 CANCELADO, 84 VENCIDO
  const statusDistribution = [
    ...Array(147).fill(ChargeStatus.PAGO),
    ...Array(262).fill(ChargeStatus.PENDENTE),
    ...Array(7).fill(ChargeStatus.CANCELADO),
    ...Array(84).fill(ChargeStatus.VENCIDO),
  ];

  // Shuffle the array
  for (let i = statusDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statusDistribution[i], statusDistribution[j]] = [statusDistribution[j], statusDistribution[i]];
  }

  // Create 500 charges distributed among the customers
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const threeMonthsAhead = new Date(now);
  threeMonthsAhead.setMonth(now.getMonth() + 3);

  for (let i = 0; i < 500; i++) {
    const customer = customers[i % 20]; // Distribute evenly among the 20 customers
    const status = statusDistribution[i];
    
    let dueDate: Date = new Date();
    let amount: number = 0;

    // Define date logic based on status
    switch (status) {
      case ChargeStatus.PAGO:
        // Paid charges have due dates in the past
        dueDate = randomDate(sixMonthsAgo, now);
        amount = parseFloat((Math.random() * 900 + 100).toFixed(2)); // 100 a 1000
        break;
      case ChargeStatus.VENCIDO:
        // Overdue charges have due dates in the past
        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(now.getMonth() - 2);
        dueDate = randomDate(twoMonthsAgo, now);
        amount = parseFloat((Math.random() * 900 + 100).toFixed(2));
        break;
      case ChargeStatus.PENDENTE:
        // Pending charges have future due dates
        dueDate = randomDate(now, threeMonthsAhead);
        amount = parseFloat((Math.random() * 900 + 100).toFixed(2));
        break;
      case ChargeStatus.CANCELADO:
        // Canceled charges can have any date
        dueDate = randomDate(sixMonthsAgo, threeMonthsAhead);
        amount = parseFloat((Math.random() * 900 + 100).toFixed(2));
        break;
    }

    await prisma.charge.create({
      data: {
        customerId: customer.id,
        amount,
        dueDate,
        status,
      },
    });

    if ((i + 1) % 100 === 0) {
      console.log(`⏳ Created ${i + 1}/500 charges...`);
    }
  }

  console.log('✅ Created 500 charges');
  console.log('\n📊 Distribution:');
  console.log('  - PAGO: 147');
  console.log('  - PENDENTE: 262');
  console.log('  - CANCELADO: 7');
  console.log('  - VENCIDO: 84');
  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
