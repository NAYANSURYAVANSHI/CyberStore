const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Hardware-only categories from DummyJSON + their store label
const HARDWARE_CATEGORIES = [
  { slug: 'smartphones',       label: 'Smartphones'  },
  { slug: 'laptops',           label: 'Laptops'       },
  { slug: 'tablets',           label: 'Tablets'       },
  { slug: 'mobile-accessories',label: 'Accessories'   },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    let allProducts = [];

    for (const cat of HARDWARE_CATEGORIES) {
      console.log(`  Fetching ${cat.label}…`);
      const res = await fetch(
        `https://dummyjson.com/products/category/${cat.slug}?limit=100&select=title,description,price,stock,category,thumbnail,images,brand,rating,discountPercentage`
      );
      if (!res.ok) throw new Error(`Failed to fetch ${cat.slug}: ${res.status}`);
      const data = await res.json();

      const mapped = (data.products || []).map(item => {
        let description = item.description || '';
        if (item.brand) description = `${item.brand} — ${description}`;
        if (item.rating) description += ` ★ Rated ${item.rating.toFixed(1)}/5.`;

        return {
          name: item.title,
          description,
          price: parseFloat((item.price || 0).toFixed(2)),
          stock_quantity: item.stock || Math.floor(Math.random() * 60) + 10,
          category: cat.label,        // uses our schema's category label
          image_url: item.thumbnail || (item.images?.[0]) || 'https://via.placeholder.com/400',
          rating: item.rating || 4.0,
          discountPercentage: item.discountPercentage || 0,
        };
      });

      allProducts = allProducts.concat(mapped);
      console.log(`    → ${mapped.length} products added`);
    }

    await Product.deleteMany({});
    console.log('\nExisting products cleared');

    const inserted = await Product.insertMany(allProducts);
    console.log(`\n✅ ${inserted.length} hardware products seeded!\n`);

    const summary = HARDWARE_CATEGORIES.map(c => ({
      category: c.label,
      count: inserted.filter(p => p.category === c.label).length,
    }));

    console.log('Breakdown:');
    summary.forEach(s => console.log(`  • ${s.category}: ${s.count}`));

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message || err);
    process.exit(1);
  }
};

seedProducts();
