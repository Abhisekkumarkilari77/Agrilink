// Helper utility to get accurate high-resolution images based on product names and categories

const PRODUCT_IMAGE_MAP = [
  { keywords: ['spinach', 'palak', 'methi', 'coriander', 'leafy'], url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80' },
  { keywords: ['mango', 'banginapalli', 'alphonso'], url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80' },
  { keywords: ['lemon', 'lemons', 'lime', 'citrus'], url: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=500&q=80' },
  { keywords: ['ghee', 'a2 ghee', 'desi ghee'], url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80' },
  { keywords: ['tomato', 'tomatoes'], url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80' },
  { keywords: ['potato', 'potatoes', 'aloo'], url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80' },
  { keywords: ['onion', 'onions'], url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80' },
  { keywords: ['chilli', 'chili', 'mirchi'], url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&q=80' },
  { keywords: ['bhindi', 'lady finger', 'okra'], url: 'https://images.unsplash.com/photo-1625943553852-781c1ff8aef4?w=500&q=80' },
  { keywords: ['carrot', 'carrots'], url: 'https://images.unsplash.com/photo-1598170845058-12ef4a457c3b?w=500&q=80' },
  { keywords: ['cauliflower', 'gobi'], url: 'https://images.unsplash.com/photo-1568584711271-e0037e23112b?w=500&q=80' },
  { keywords: ['cabbage'], url: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&q=80' },
  { keywords: ['capsicum', 'bell pepper'], url: 'https://images.unsplash.com/photo-1566842600175-e76042b39418?w=500&q=80' },
  { keywords: ['brinjal', 'eggplant', 'baingan'], url: 'https://images.unsplash.com/photo-1628751050140-09c59d871987?w=500&q=80' },
  { keywords: ['cucumber', 'khira'], url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&q=80' },
  { keywords: ['banana', 'bananas'], url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80' },
  { keywords: ['apple', 'apples'], url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80' },
  { keywords: ['papaya', 'fresh papaya'], url: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=500&q=80' },
  { keywords: ['pomegranate', 'anar'], url: 'https://images.unsplash.com/photo-1541348263662-e0c8643c21ec?w=500&q=80' },
  { keywords: ['watermelon', 'tarbooz'], url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80' },
  { keywords: ['guava'], url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&q=80' },
  { keywords: ['grapes', 'grape'], url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80' },
  { keywords: ['orange', 'mosambi'], url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80' },
  { keywords: ['dragon fruit'], url: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=500&q=80' },
  { keywords: ['milk'], url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80' },
  { keywords: ['paneer', 'cottage cheese'], url: 'https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=500&q=80' },
  { keywords: ['curd', 'dahi', 'yogurt'], url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80' },
  { keywords: ['butter', 'makhan'], url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80' },
  { keywords: ['buttermilk', 'chaas'], url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80' },
  { keywords: ['rice', 'basmati', 'sona masuri'], url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
  { keywords: ['wheat', 'atta'], url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80' },
  { keywords: ['ragi', 'finger millet', 'millet', 'bajra', 'jowar'], url: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=500&q=80' },
  { keywords: ['toor dal', 'toor', 'arhar dal', 'pigeon pea'], url: 'https://cdn.pixabay.com/photo/2016/10/17/17/17/dal-1740205_1280.png' },
  { keywords: ['dal', 'toor', 'moong', 'urad', 'pulse', 'gram'], url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
  { keywords: ['egg', 'eggs'], url: 'https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80' },
  { keywords: ['honey'], url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80' },
  { keywords: ['rose', 'roses'], url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80' },
  { keywords: ['jasmine', 'mallepulu'], url: 'https://images.unsplash.com/photo-1507290439931-a8e023f0a850?w=500&q=80' },
  { keywords: ['marigold', 'genda'], url: 'https://images.unsplash.com/photo-1508784932257-4b55ac6e5e8e?w=500&q=80' },
  { keywords: ['lotus', 'lotus bud', 'lotus buds'], url: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=500&q=80' },
  { keywords: ['flower', 'flowers'], url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80' },
  { keywords: ['groundnut', 'groundnuts', 'peanut', 'peanuts'], url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&q=80' },
  { keywords: ['peanut oil', 'groundnut oil', 'cold-pressed peanut oil', 'cold-pressed groundnut oil'], url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80' },
];

export const getAccurateProductImage = (name = '', category = '', currentImage = '') => {
  const cleanName = (name || '').toLowerCase();
  const cleanCat = (category || '').toLowerCase();

  // If currentImage is a valid Unsplash URL or non-broken URL, check if current image matches name
  // If currentImage contains known bad/mismatched pexels IDs (like 2290293 for poppy flower or 10118334 for menu), override it!
  const isMismatched = currentImage.includes('2290293') || currentImage.includes('10118334') || currentImage.includes('10125828');

  if (currentImage && !isMismatched && currentImage.startsWith('http')) {
    // Check if current image is already an unsplash image or custom uploaded image
    // Still match name if name has explicit keyword match
    for (const item of PRODUCT_IMAGE_MAP) {
      if (item.keywords.some(kw => cleanName.includes(kw))) {
        return item.url;
      }
    }
    return currentImage;
  }

  // Find by name keywords
  for (const item of PRODUCT_IMAGE_MAP) {
    if (item.keywords.some(kw => cleanName.includes(kw))) {
      return item.url;
    }
  }

  // Find by category keywords
  for (const item of PRODUCT_IMAGE_MAP) {
    if (item.keywords.some(kw => cleanCat.includes(kw))) {
      return item.url;
    }
  }

  // Default fallback
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
};

export default getAccurateProductImage;
