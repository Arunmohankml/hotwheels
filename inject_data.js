const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jucvcbcgmfjnpmwgplwx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1Y3ZjYmNnbWZqbnBtd2dwbHd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4NDU3MiwiZXhwIjoyMDkzNjYwNTcyfQ.ulZ6J_Y2GpKAyf27pH7hdwwg7pc7uOFmAt-HVLMsvKg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inject() {
  console.log('--- Injecting 20 New Cars ---');
  const carImages = [
    'https://purepng.com/public/uploads/large/purepng.com-orange-hot-wheels-carhot-wheels-carhot-wheelsdie-cast-cars-1701528205466cuj0b.png',
    'https://purepng.com/public/uploads/large/purepng.com-blue-hot-wheels-carhot-wheels-carhot-wheelsdie-cast-cars-1701528205566uxtq8.png',
    'https://purepng.com/public/uploads/large/purepng.com-silver-hot-wheels-carhot-wheels-carhot-wheelsdie-cast-cars-1701528205666vx5z9.png',
    'https://purepng.com/public/uploads/large/purepng.com-red-hot-wheels-carhot-wheels-carhot-wheelsdie-cast-cars-1701528205766z9a1j.png'
  ];

  const categories = ['Elite', 'Signature', 'Mainline'];
  const series = ['Speed Demons', 'Street Tuners', 'Track Day', 'Night Burnerz', 'Muscle Mania'];

  const newProducts = [];
  for (let i = 1; i <= 20; i++) {
    newProducts.push({
      name: `Collector Model ${i}`,
      series: series[Math.floor(Math.random() * series.length)],
      price: Math.floor(Math.random() * 5000) + 1500,
      stock: 10,
      category: categories[Math.floor(Math.random() * categories.length)],
      image_url: carImages[Math.floor(Math.random() * carImages.length)],
      is_featured: i <= 5,
      is_limited: i % 4 === 0
    });
  }

  const { data: prods, error: pError } = await supabase.from('products').insert(newProducts).select();
  if (pError) console.error('Product Error:', pError);
  else console.log(`Successfully added ${prods.length} products.`);

  const statuses = ['paid', 'shipped', 'delivered'];
  const sampleAddress = {
    fullName: "Arun Mohan",
    email: "arunmohankml@gmail.com",
    address: "123 Speed Street, Mumbai, India",
    city: "Mumbai",
    zip: "400001"
  };

  for (const status of statuses) {
    console.log(`--- Injecting 20 ${status} Orders ---`);
    const newOrders = [];
    for (let i = 1; i <= 20; i++) {
      const orderItems = [];
      const numItems = Math.floor(Math.random() * 2) + 1;
      let totalAmount = 0;
      
      for(let j=0; j<numItems; j++) {
        const p = prods[Math.floor(Math.random() * prods.length)];
        orderItems.push({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: 1,
          image_url: p.image_url
        });
        totalAmount += p.price;
      }

      newOrders.push({
        total_amount: totalAmount,
        shipping_address: sampleAddress,
        status: status,
        created_at: new Date(Date.now() - (i * 3600000)).toISOString()
      });
    }

    const { error: oError } = await supabase.from('orders').insert(newOrders);
    if (oError) console.error(`${status} Order Error:`, oError);
    else console.log(`Successfully added 20 ${status} orders.`);
  }

  console.log('Injection Complete!');
}

inject();
