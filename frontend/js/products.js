const products = [
  { id: 1, name: 'Sport Kini Black', 
    stock: 1, 
    price: 149999, 
    image: ['frontend/images/sport-black-full.png'],
    images: [
      'frontend/images/sport-black-full.png',
      'frontend/images/sport-black-top.png',
      'frontend/images/sport-black-bottom.png'
    ],
    sizes: ['M'],
    colors: [{name: 'Black', hex: '#1a1513' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 2, name: 'Midnight Blue', 
    stock: 4, 
    price: 169999, 
    image: ['frontend/images/blue-full-removebg-preview.png'],
    images: [
      'frontend/images/blue-full-removebg-preview.png',
      'frontend/images/blue-back-removebg-preview.png',
      'frontend/images/blue-top-removebg-preview.png',
      'frontend/images/blue-bottom-removebg-preview.png'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [{name: 'Blue', hex: '#06275f' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 3, name: 'Wood Land', 
    stock: 2, 
    price: 129999, 
    image: ['frontend/images/wood-full-removebg-preview.png'],
    images: [
      'frontend/images/wood-full-removebg-preview.png',
      'frontend/images/wood-top-removebg-preview.png',
      'frontend/images/wood-bottom-removebg-preview.png'
    ],  
    sizes: ['L'],
    colors: [{name: 'Motif', hex: '#a67c52' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']  
  },

  { id: 4, name: 'Sunset Glow', 
    stock: 2, 
    price: 129999, 
    image: ['frontend/images/pink-yellow-full.png'],
    images: [
      'frontend/images/pink-yellow-full.png',
      'frontend/images/pink-yellow-back.png',
      'frontend/images/pink-yellow-top.png',
      'frontend/images/pink-yellow-bottom.png'
    ],
    sizes: ['M'],
    colors: [{name: 'Orange Purple', hex: '#d9744c' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 5, name: 'Love in Pink', 
    stock: 3, 
    price: 169999, 
    image: ['frontend/images/pink-love-full-removebg-preview.png'],
    images: [
      'frontend/images/pink-love-full-removebg-preview.png',
      'frontend/images/pink-love-back-removebg-preview.png',
      'frontend/images/pink-love-top-removebg-preview.png',
      'frontend/images/pink-love-bottom-removebg-preview.png'
    ],
    sizes: ['S'],
    colors: [{name: 'Red', hex: '#b11226' }, {name: 'Pink', hex: '#e75480' }, {name: 'White', hex: '#ffffff' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 6, name: 'Coral Reef Set', 
    stock: 2, 
    price: 149999, 
    image: ['frontend/images/blue-strings-full-removebg-preview.png'],
    images: [
      'frontend/images/blue-strings-full-removebg-preview.png',
      'frontend/images/blue-strings-back-removebg-preview.png',
      'frontend/images/blue-strings-top-removebg-preview.png',
      'frontend/images/blue-strings-bottom-removebg-preview.png'
    ],
    sizes: ['M'],
    colors: [{name: 'Sky Blue', hex: '#5bc0de' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 7, name: 'Cherry Love Set', 
    stock: 1, 
    price: 129999, 
    image : ['frontend/images/cherry-full.png'],
    images: [
      'frontend/images/cherry-full.png',
      'frontend/images/cherry-back.png',
      'frontend/images/cherry-top.png',
      'frontend/images/cherry-bottom.png'
    ],
    sizes: ['S'],
    colors: [{name: 'White with Cherry Motifs', hex: '#ff4d6d' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 8, name: 'Caramel Dream Set', 
    stock: 1, 
    price: 139999, 
    image : ['frontend/images/brown-white-full.png'],
    images: [
      'frontend/images/brown-white-full.png',
      'frontend/images/brown-white-back.png',
      'frontend/images/brown-white-top.png',
      'frontend/images/brown-white-bottom.png'
    ],
    sizes: ['S'],
    colors: [{name: 'Brown with White Straps', hex: '#6f4e37' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 9,
    name: 'Sport Kini Green',
    stock: 1,
    price: 159999,
    image: ['frontend/images/sport-green-full.png'],
    images: [
      'frontend/images/sport-green-full.png',
      'frontend/images/sport-green-top.png',
      'frontend/images/sport-green-bottom.png'
    ],
    sizes: ['S'],
    colors: [{name: 'Green', hex: '#1a4d30' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  {id: 10,
    name: 'Watermelon Skort',
    stock: 1,
    price: 179999,
    image: ['frontend/images/bright-red-skirt-full.png'],
    images: [
      'frontend/images/bright-red-skirt-full.png',
      'frontend/images/bright-red-skirt-back.png',
      'frontend/images/bright-red-skirt-top.png',
      'frontend/images/bright-red-skirt-bottom.png',
      'frontend/images/bright-red-skirt-skirt.png'
    ],
    sizes: ['L'],
    colors: [{name: 'Bright Red', hex: '#ff4040' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  {id: 11,
    name: 'Pink Leopard Set',
    stock: 2,
    price: 149999,
    image: ['frontend/images/pink-lion-full.png'],
    images: [
      'frontend/images/pink-lion-full.png',
      'frontend/images/pink-lion-top.png',
      'frontend/images/pink-lion-bottom.png'
    ],
    sizes: ['M'],
    colors: [{name: 'Pink Leopard', hex: '#d36f6f' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  {id: 12,
    name: 'Pink Skort Set',
    stock: 1,
    price: 139999,
    image: ['frontend/images/pink-skirt-full.png'],
    images: [
      'frontend/images/pink-skirt-full.png',
      'frontend/images/pink-skirt-back.png',
      'frontend/images/pink-skirt-top.png',
      'frontend/images/pink-skirt-bottom.png'
    ],
    sizes: ['S'],
    colors: [{name: 'Pink', hex: '#ff69b4' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  {id: 13,
    name: 'In Love',
    stock: 1,
    price: 199.999,
    image: ['frontend/images/dark-red-skirt-full.png'],
    images: [
      'frontend/images/dark-red-skirt-full.png',
      'frontend/images/dark-red-skirt-back.png',
      'frontend/images/dark-red-skirt-top.png',
      'frontend/images/dark-red-skirt-bottom.png',
      'frontend/images/dark-red-skirt-skirt.png' 
    ],
    sizes: ['S'],
    colors: [{name: 'Dark Red', hex: '#8b0000' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  {id: 14,
    name: 'Midnight Skort',
    stock: 1,
    price: 189999,
    image: ['frontend/images/dark-blue-skirt-full.png'],
    images: [
      'frontend/images/dark-blue-skirt-full.png',
      'frontend/images/dark-blue-skirt-top.png',
      'frontend/images/dark-blue-skirt-bottom.png',
      'frontend/images/dark-blue-skirt-skirt.png'
    ],
    sizes: ['M'],
    colors: [{name: 'Dark Blue', hex: '#00008b' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'
    ]
  },

  {id: 15,
    name: 'Sky Blue Skirt',
    stock: 1,
    price: 179999,
    image: ['frontend/images/blue-resort-full.png'],
    images: [
      'frontend/images/blue-resort-full.png',
      'frontend/images/blue-resort-top.png',
      'frontend/images/blue-resort-bottom.png',
      'frontend/images/blue-resort-skirt.png'
    ],
    sizes: ['L'],
    colors: [{name: 'Sky Blue', hex: '#87ceeb' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  {id: 16,
    name: 'Choco Chic Skirt',
    stock: 2,
    price: 199999,
    image: ['frontend/images/Untitled_design-removebg-preview.png'],
    images: [
      'frontend/images/Untitled_design-removebg-preview.png',
      'frontend/images/choco-skirt-top.png',
      'frontend/images/choco-skirt-bottom.png',
      'frontend/images/choco-skirt-skirt.png',
      'frontend/images/choco-skirt-close.png'

    ],
    sizes: ['M'],
    colors: [{name: 'Chocolate Brown', hex: '#7b3f00' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  {id: 17,
    name: 'Pink Strings',
    stock: 1,
    price: 149999,
    image: ['frontend/images/pink-strings-full-removebg-preview.png'],
    images: [
      'frontend/images/pink-strings-full-removebg-preview.png',
      'frontend/images/pink-strings-back-removebg-preview.png',
      'frontend/images/pink-strings-top-removebg-preview.png',
      'frontend/images/pink-strings-bottom-removebg-preview.png'
    ],
    sizes: ['S'],
    colors: [{name: 'Pink', hex: '#ff69b4' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },
  
  { id: 18,
    name: 'Pink Disco',
    stock: 1,
    price: 139999,
    image: ['frontend/images/pink-disco-full-removebg-preview.png'],
    images: [
      'frontend/images/pink-disco-full-removebg-preview.png',
      'frontend/images/pink-disco-back-removebg-preview.png',
      'frontend/images/pink-disco-top-removebg-preview.png',
      'frontend/images/pink-disco-bottom-removebg-preview.png'
    ],
    sizes: ['M'],
    colors: [{name: 'Pink', hex: '#ff69b4' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 19,
    name: 'Midnight Red',
    stock: 1,
    price: 169999,
    image: ['frontend/images/red-midnight-full-removebg-preview.png'],
    images: [
      'frontend/images/red-midnight-full-removebg-preview.png',
      'frontend/images/red-midnight-back-removebg-preview.png',
      'frontend/images/red-midnight-top-removebg-preview.png',
      'frontend/images/red-midnight-bottom-removebg-preview.png'
    ],
    sizes: ['L'],
    colors: [{name: 'Dark Red', hex: '#8b0000' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  }
];