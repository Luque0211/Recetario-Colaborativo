import prisma from '../src/config/prisma.js';

async function main() {
  const categorias = [
    'Desayunos',
    'Almuerzos y Cenas',
    'Pastas',
    'Carnes',
    'Vegetariano',
    'Postres',
    'Bebidas'
  ];

  for (const nombre of categorias) {
    const existe = await prisma.categoria.findFirst({
      where: { nombre }
    });

    if (!existe) {
      await prisma.categoria.create({
        data: { nombre }
      });
    }
  }

  console.log('Categorías cargadas correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });