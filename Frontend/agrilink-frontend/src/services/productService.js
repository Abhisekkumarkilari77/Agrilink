import axiosInstance, { MOCK_MODE } from '../api/axiosConfig';

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Organic Tomatoes',
    farmerName: 'Rajesh Kumar',
    farmerId: '2',
    farmName: 'Rajesh Fresh Greens',
    category: 'Vegetables',
    price: 35,
    quantity: 150,
    organic: true,
    rating: 4.8,
    distance: 4.2,
    harvestDate: '2026-07-18',
    freshness: 'High',
    description: 'Freshly harvested vine-ripened organic tomatoes. Chemical-free and delicious.',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&q=80',
    reviews: [
      { user: 'Abhisek', rating: 5, comment: 'Extremely fresh and delicious!' },
      { user: 'Sneha', rating: 4.5, comment: 'Good quality, quick delivery.' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Fresh Alphonso Mangoes',
    farmerName: 'Amit Singh',
    farmerId: '3',
    farmName: 'Amit Organic Farms',
    category: 'Fruits',
    price: 180,
    quantity: 60,
    organic: true,
    rating: 4.9,
    distance: 8.5,
    harvestDate: '2026-07-19',
    freshness: 'Excellent',
    description: 'Juicy, naturally ripened Alphonso mangoes directly from the orchard.',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',
    reviews: [
      { user: 'Vijay', rating: 5, comment: 'The best mangoes I have had this season.' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Pure Cow Milk',
    farmerName: 'Rajesh Kumar',
    farmerId: '2',
    farmName: 'Rajesh Fresh Greens',
    category: 'Dairy',
    price: 60,
    quantity: 80,
    organic: false,
    rating: 4.6,
    distance: 4.2,
    harvestDate: '2026-07-20',
    freshness: 'High',
    description: 'Fresh, pasteurized pure cow milk, unadulterated and full of nutrients.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    reviews: [
      { user: 'Suresh', rating: 4, comment: 'Very thick and fresh milk.' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Premium Basmati Rice',
    farmerName: 'Amit Singh',
    farmerId: '3',
    farmName: 'Amit Organic Farms',
    category: 'Grains',
    price: 95,
    quantity: 500,
    organic: true,
    rating: 4.7,
    distance: 8.5,
    harvestDate: '2026-06-15',
    freshness: 'High',
    description: 'Aged long-grain aromatic Basmati rice, harvested organically.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    reviews: []
  },
  {
    id: 'prod-5',
    name: 'Fresh Red Roses',
    farmerName: 'Rajesh Kumar',
    farmerId: '2',
    farmName: 'Rajesh Fresh Greens',
    category: 'Flowers',
    price: 15,
    quantity: 200,
    organic: false,
    rating: 4.5,
    distance: 4.2,
    harvestDate: '2026-07-20',
    freshness: 'High',
    description: 'Freshly cut long-stemmed red roses, perfect for decorations or gifts.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    reviews: []
  },
  {
    id: 'prod-6',
    name: 'Country Eggs (Pack of 6)',
    farmerName: 'Amit Singh',
    farmerId: '3',
    farmName: 'Amit Organic Farms',
    category: 'Eggs',
    price: 48,
    quantity: 100,
    organic: true,
    rating: 4.8,
    distance: 8.5,
    harvestDate: '2026-07-20',
    freshness: 'High',
    description: 'Nutritious free-range country eggs from organically fed poultry.',
    image: 'https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=400&q=80',
    reviews: []
  }
];

export const productService = {
  getProducts: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_PRODUCTS;
    }
    const response = await axiosInstance.get('/products');
    return response.data.data || response.data;
  },

  getProductById: async (id) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (product) return product;
      throw new Error('Product not found');
    }
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data.data || response.data;
  },

  searchProducts: async (query) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const term = query.toLowerCase();
      return MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term) ||
        p.farmerName.toLowerCase().includes(term)
      );
    }
    const response = await axiosInstance.get(`/products/search?query=${query}`);
    return response.data.data || response.data;
  }
};

export default productService;
