const Product = require('../models/Product');

// Pool of high-quality electronics image URLs from Unsplash
const IMAGE_POOL = {
  gpu: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80',
  cpu: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  ram: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
  ssd: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  laptop: 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&w=600&q=80',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
  tech: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
};

// Capitalize words utility
const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Dynamically constructs and seeds a list of products matching the user's search query.
 */
exports.generateAndSeed = async (searchQuery) => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return [];

  const newProducts = [];

  // Helper to create a basic template
  const createProductTemplate = ({ name, description, price, category, imageKey, specs }) => {
    const discount = Math.floor(Math.random() * 15 + 5); // 5% - 20%
    const stock = Math.floor(Math.random() * 85 + 3);   // 3 - 88 in stock
    const rating = parseFloat((4.1 + Math.random() * 0.9).toFixed(1)); // 4.1 - 5.0
    return {
      name,
      description,
      price,
      category,
      image_url: IMAGE_POOL[imageKey] || IMAGE_POOL.tech,
      stock_quantity: stock,
      rating,
      discountPercentage: discount,
      specs,
      specs_text: specs.join(' · '),
    };
  };

  // Determine matching templates based on query keywords
  if (query.includes('rtx') || query.includes('gpu') || query.includes('graphics') || query.includes('nvidia') || query.includes('geforce')) {
    let model = '4070 Ti Super';
    let price = 799.99;
    if (query.includes('4090')) { model = '4090 OC Edition'; price = 1599.99; }
    else if (query.includes('4080')) { model = '4080 Super'; price = 999.99; }
    else if (query.includes('4060')) { model = '4060 Ti'; price = 399.99; }
    else if (query.includes('7900') || query.includes('radeon') || query.includes('rx')) { model = 'Radeon RX 7900 XTX'; price = 949.99; }

    newProducts.push(createProductTemplate({
      name: model.includes('Radeon') ? model : `NVIDIA GeForce RTX ${model}`,
      description: `Premium graphics card designed for hardcore gaming and creative workflows. Features next-gen ray tracing cores, tensor cores, and ultra-fast memory bus.`,
      price,
      category: 'Accessories',
      imageKey: 'gpu',
      specs: ['16GB GDDR6X VRAM', 'PCI Express 4.0', 'DLSS 3 AI Frame Gen', '3x DisplayPort / 1x HDMI'],
    }));
  }

  else if (query.includes('ryzen') || query.includes('intel') || query.includes('cpu') || query.includes('processor') || query.includes('core')) {
    let cpuName = 'Intel Core i7-14700K Desktop Processor';
    let price = 389.99;
    let specs = ['20 Cores (8 P-cores + 12 E-cores)', 'Up to 5.6 GHz Max Clock', 'LGA1700 Socket', 'Intel UHD Graphics 770'];

    if (query.includes('ryzen 9') || query.includes('7950') || query.includes('7900')) {
      cpuName = 'AMD Ryzen 9 7950X3D Processor';
      price = 649.99;
      specs = ['16 Cores / 32 Threads', 'AMD 3D V-Cache Technology', 'Socket AM5', 'Up to 5.7 GHz Boost Clock'];
    } else if (query.includes('ryzen 7') || query.includes('7800x3d')) {
      cpuName = 'AMD Ryzen 7 7800X3D Gaming Processor';
      price = 399.99;
      specs = ['8 Cores / 16 Threads', 'Best-in-class Gaming Performance', 'Socket AM5', '96MB L3 Cache'];
    } else if (query.includes('i9') || query.includes('14900')) {
      cpuName = 'Intel Core i9-14900K Desktop Processor';
      price = 549.99;
      specs = ['24 Cores (8 P-cores + 16 E-cores)', 'Up to 6.0 GHz Turbo Clock', 'LGA1700 Socket', 'PCIe 5.0 & DDR5 Support'];
    }

    newProducts.push(createProductTemplate({
      name: cpuName,
      description: `High-performance desktop processor engineered for ultra-fast gaming speeds, intensive compiling, multi-threaded video editing, and modern multitasking workloads.`,
      price,
      category: 'Accessories',
      imageKey: 'cpu',
      specs,
    }));
  }

  else if (query.includes('keyboard') || query.includes('mechanical') || query.includes('keychron')) {
    newProducts.push(createProductTemplate({
      name: 'Keychron Q3 Pro QMK/VIA Mechanical Keyboard',
      description: `Full metal custom mechanical keyboard with support for QMK/VIA key mapping, double-gasket dampening design, and factory pre-lubed tactile switches for the ultimate typing feel.`,
      price: 189.99,
      category: 'Accessories',
      imageKey: 'keyboard',
      specs: ['Full Aluminum Body', 'Hot-Swappable Switches', 'Bluetooth 5.1 & Type-C Wired', 'South-Facing RGB Backlight'],
    }));
  }

  else if (query.includes('mouse') || query.includes('razer') || query.includes('logitech')) {
    newProducts.push(createProductTemplate({
      name: 'Logitech G Pro X Superlight 2 Gaming Mouse',
      description: `Ultra-lightweight wireless gaming mouse engineered with pro players to deliver lightning-fast speed, high reliability, and premium tracking responsiveness.`,
      price: 149.99,
      category: 'Accessories',
      imageKey: 'mouse',
      specs: ['Less than 60g Weight', 'HERO 2 Sensor (32,000 DPI)', 'LIGHTSPEED Wireless Connectivity', 'Up to 95 Hours Battery Life'],
    }));
  }

  else if (query.includes('monitor') || query.includes('display') || query.includes('screen')) {
    newProducts.push(createProductTemplate({
      name: 'ASUS ROG Swift 27" OLED Gaming Monitor',
      description: `Premium 27-inch gaming display featuring self-illuminating OLED technology, insane refresh rate speeds, and an anti-glare screen coating for incredible visual depth.`,
      price: 899.99,
      category: 'Accessories',
      imageKey: 'monitor',
      specs: ['2560 x 1440 WQHD OLED Panel', '240Hz Refresh Rate', '0.03ms Response Time', 'G-Sync Compatible'],
    }));
  }

  else if (query.includes('ram') || query.includes('ddr5') || query.includes('memory')) {
    newProducts.push(createProductTemplate({
      name: 'G.Skill Trident Z5 RGB 32GB DDR5 RAM Kit',
      description: `Extreme performance DDR5 memory kit designed for gaming and overclocking, featuring customizable dynamic RGB lightbars and sleek aluminum heatspreaders.`,
      price: 124.99,
      category: 'Accessories',
      imageKey: 'ram',
      specs: ['32GB (2 x 16GB) Capacity', 'DDR5 6000MHz Speed', 'CL30 Low Latency', 'Intel XMP 3.0 Profile Support'],
    }));
  }

  else if (query.includes('ssd') || query.includes('storage') || query.includes('nvme')) {
    newProducts.push(createProductTemplate({
      name: 'Samsung 990 PRO 2TB NVMe M.2 SSD',
      description: `Top-tier PCIe 4.0 solid state drive offering extreme read and write speeds, thermal smart controller protection, and maximum bandwidth performance.`,
      price: 169.99,
      category: 'Accessories',
      imageKey: 'ssd',
      specs: ['2TB Storage Capacity', 'Up to 7,450 MB/s Sequential Reads', 'PCIe Gen 4.0 x4 Interface', 'Dynamic Thermal Guard'],
    }));
  }

  else if (query.includes('iphone') || query.includes('apple') || query.includes('phone') || query.includes('galaxy') || query.includes('pixel') || query.includes('smartphone')) {
    let name = 'Apple iPhone 15 Pro Max';
    let price = 1199.00;
    let specs = ['6.7" Super Retina XDR OLED', 'A17 Pro 3nm Silicon Chip', '5x Optical Zoom Telephoto', 'Titanium Build with Action Button'];

    if (query.includes('s24') || query.includes('samsung') || query.includes('galaxy')) {
      name = 'Samsung Galaxy S24 Ultra';
      price = 1299.00;
      specs = ['6.8" Dynamic AMOLED 2X Display', 'Snapdragon 8 Gen 3 Processor', '200MP Quad Rear Camera', 'Built-in S-Pen Stylus'];
    } else if (query.includes('pixel') || query.includes('google')) {
      name = 'Google Pixel 8 Pro';
      price = 999.00;
      specs = ['6.7" Super Actua Display', 'Google Tensor G3 Chip', 'Advanced AI Photo Editing Features', '7 Years of OS Updates'];
    }

    newProducts.push(createProductTemplate({
      name,
      description: `Flagship mobile smartphone packed with bleeding-edge processors, a multi-lens studio camera module, all-day battery life, and premium titanium/aluminum frame crafting.`,
      price,
      category: 'Smartphones',
      imageKey: 'phone',
      specs,
    }));
  }

  else if (query.includes('macbook') || query.includes('laptop') || query.includes('thinkpad') || query.includes('notebook') || query.includes('dell') || query.includes('zenbook')) {
    let name = 'Apple MacBook Pro 14" (M3 Max)';
    let price = 2499.00;
    let specs = ['Apple M3 Max Chip (14-core CPU)', '36GB Unified Memory', '1TB Fast SSD Storage', '14.2-inch Liquid Retina XDR'];

    if (query.includes('xps') || query.includes('dell')) {
      name = 'Dell XPS 15 Creator Edition';
      price = 1899.99;
      specs = ['Intel Core i9-13900H Processor', '32GB DDR5 RAM / 1TB NVMe SSD', 'NVIDIA GeForce RTX 4060 GPU', '15.6" InfinityEdge Display'];
    } else if (query.includes('thinkpad') || query.includes('lenovo')) {
      name = 'Lenovo ThinkPad X1 Carbon Gen 11';
      price = 1549.00;
      specs = ['Intel Core i7 vPro 13th Gen', '16GB RAM / 512GB SSD', 'Military-Grade Durable Body', 'Ultralight Carbon Fiber Chassis'];
    }

    newProducts.push(createProductTemplate({
      name,
      description: `High-caliber professional laptop built to handle heavy multitasking, complex simulations, design compiling, and long-range battery operations.`,
      price,
      category: 'Laptops',
      imageKey: 'laptop',
      specs,
    }));
  }

  else if (query.includes('ipad') || query.includes('tablet') || query.includes('galaxy tab')) {
    let name = 'Apple iPad Pro 11" (M2)';
    let price = 799.00;
    let specs = ['Apple M2 Silicon Processor', '11" Liquid Retina ProMotion Display', 'Wi-Fi 6E Wireless Speed', 'Face ID Secure Authentication'];

    if (query.includes('ultra') || query.includes('tab s')) {
      name = 'Samsung Galaxy Tab S9 Ultra';
      price = 1199.00;
      specs = ['14.6" Dynamic AMOLED 2X', 'Snapdragon 8 Gen 2 for Galaxy', 'IP68 Dust & Water Resistant', 'Bundled S-Pen stylus'];
    }

    newProducts.push(createProductTemplate({
      name,
      description: `Next-generation lightweight tablet that blends productivity and entertainment, featuring multi-touch gestures, smart stylus compatibility, and powerful mobile computing speeds.`,
      price,
      category: 'Tablets',
      imageKey: 'tablet',
      specs,
    }));
  }

  // Fallback: If no specific templates matched, dynamically build a generic tech product matching the terms!
  if (newProducts.length === 0) {
    const cleanSearch = capitalize(query);
    newProducts.push(createProductTemplate({
      name: `${cleanSearch} Edition Pro`,
      description: `Advanced tech accessory featuring a modern industrial design, customized hardware performance optimization, and premium grade build quality.`,
      price: parseFloat((49.99 + Math.random() * 450).toFixed(2)),
      category: 'Accessories',
      imageKey: 'tech',
      specs: ['Ergonomic Modern Fit', 'Plug-and-play Compatibility', '1-Year Limited Warranty Included', 'Engineered to last'],
    }));
  }

  // Write new products to the MongoDB collection
  const seeded = [];
  for (const prodData of newProducts) {
    // Avoid creating duplicate names
    const exists = await Product.findOne({ name: prodData.name });
    if (!exists) {
      const saved = await Product.create(prodData);
      seeded.push(saved);
    } else {
      seeded.push(exists);
    }
  }

  console.log(`Dynamic seeding completed: ${seeded.length} hardware products added for query "${searchQuery}"`);
  return seeded;
};
