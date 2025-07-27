export const products = [
    { id: 1, name: 'Aura Diamond Hoops', price: 249, category: 'earrings', newArrival: true, rating: 4.9, reviews: 312, description: "Elegant diamond hoops that capture and reflect light with every turn. Perfect for both day and night.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+2', 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+3', 
      ], 
      video: 'https://videos.pexels.com/video-files/3214645/3214645-hd_1280_720_25fps.mp4', 
      tryOnImage: 'src/assets/try-on/earring-1.png', tryOnScale: 0.08, tryOnType: 'earrings', tags: ['bogo', 'under299', 'friendship', 'rakhi', 'gold'], materials: "18k Gold Plated, Cubic Zirconia" }, 
    { id: 2, name: 'Serenity Pearl Necklace', price: 499, category: 'necklaces', newArrival: true, rating: 4.8, reviews: 289, description: "A timeless single pearl pendant on a delicate chain. The epitome of classic beauty and grace.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+2', 
      ], 
      video: null, 
      tryOnImage: 'src/assets/try-on/necklace-1.png', tryOnScale: 0.45, tryOnType: 'necklace', tags: ['buy2get1', 'rakhi', 'pearl'], materials: "Freshwater Pearl, Sterling Silver Chain" }, 
    { id: 3, name: 'Ethereal Moon Bracelet', price: 199, category: 'bracelets', newArrival: true, rating: 4.7, reviews: 451, description: "A charming bracelet featuring a crescent moon charm. A subtle nod to the celestial.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
      ], 
      video: null, 
      tryOnImage: null, tags: ['bogo', 'under199', 'friendship'], materials: "Stainless Steel, Moonstone Bead" }, 
    { id: 4, name: 'Glimmering Studs', price: 99, category: 'earrings', newArrival: true, rating: 4.9, reviews: 502, description: "Simple yet stunning, these glimmering studs add the perfect amount of sparkle to any outfit.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+2', 
      ], 
      video: 'https://videos.pexels.com/video-files/3214645/3214645-hd_1280_720_25fps.mp4', 
      tryOnImage: 'src/assets/try-on/earring-2.png', tryOnScale: 0.08, tryOnType: 'earrings', tags: ['bogo', 'under99', 'friendship', 'silver'], materials: "Surgical Steel, Crystal" }, 
    { id: 5, name: 'Royal Ruby Pendant', price: 799, category: 'necklaces', newArrival: false, rating: 4.8, reviews: 178, description: "A breathtaking ruby, cut to perfection and set in a classic pendant design. A true statement of luxury.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
      ], 
      video: null, 
      tryOnImage: 'src/assets/try-on/necklace-2.png', tryOnScale: 0.6, tryOnType: 'necklace', tags: ['buy2get1', 'rakhi', 'gold'], materials: "Lab-created Ruby, Gold Vermeil" }, 
    { id: 6, name: 'Celestial Charm Anklet', price: 149, category: 'others', newArrival: false, rating: 4.6, reviews: 320, description: "Adorn your ankle with this delicate chain featuring tiny star and moon charms.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
      ], 
      video: null, 
      tryOnImage: null, tags: ['under199', 'friendship'], materials: "Titanium Steel" }, 
    { id: 7, name: 'Golden Sun Drops', price: 349, category: 'earrings', newArrival: false, rating: 4.7, reviews: 215, description: "Radiate warmth with these sun-inspired drop earrings, crafted to dangle and catch the light.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
      ], 
      video: null, 
      tryOnImage: 'src/assets/try-on/earring-3.png', tryOnScale: 0.12, tryOnType: 'earrings', tags: ['buy2get1', 'gold'], materials: "Brass, Gold Plating" }, 
    { id: 8, name: 'Mystic Eye Ring', price: 299, category: 'others', newArrival: false, rating: 4.8, reviews: 199, description: "A captivating ring featuring the mystic eye symbol for protection and wisdom. A unique and meaningful piece.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
      ], 
      video: null, 
      tryOnImage: null, tags: ['under299', 'rakhi'], materials: "Enamel, Alloy" }, 
    { id: 9, name: 'Radiant Duo Set', price: 699, category: 'combo', newArrival: false, rating: 4.9, reviews: 254, description: "The perfect pair. This set includes our elegant Serenity Pearl Necklace and matching Glimmering Studs for a coordinated, sophisticated look.", 
      media: [ 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+1', 
        'https://placehold.co/600x750/f8c8dc/7c3f44?text=Image+2', 
      ], 
      video: null, 
      tryOnImage: {earring: 'src/assets/try-on/earring-2.png', necklace: 'src/assets/try-on/necklace-1.png'}, tryOnScale: {earring: 0.08, necklace: 0.45}, tryOnType: 'combo', tags: ['buy2get1', 'rakhi', 'friendship', 'pearl', 'silver'], materials: "Mixed Materials Set" } 
];