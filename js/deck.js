var deck = [
	{'type': 'infantry', 'id' : 0, 'hash' : 0, 'unit' : 1 }, // 20 Units
	{'type': 'infantry', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'infantry', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'aa', 'id' : 0, 'hash' : 0, 'unit' : 1 },
	{'type': 'drone', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'drone', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'tank', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'tank', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'a2g', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'a2g', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 

	{'type': 'arty', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'recon', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'recon', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'jet', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'jet', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'helo', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'helo', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'apc', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'bomber', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 
	{'type': 'htank', 'id' : 0, 'hash' : 0, 'unit' : 1 }, 

	{'type': 'at', 'id' : 0, 'hash' : 0, 'combo': 1 }, // 25 Combos
	{'type': 'at', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'stinger', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'frontline', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'fallback', 'id' : 0, 'hash' : 0, 'combo': 1 },

	{'type': 'frontline', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'fallback', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'cstrike', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'cstrike', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'shift', 'id' : 0, 'hash' : 0, 'combo': 1 },

	{'type': 'shift', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'shell', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'column', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'reinforce', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'coverage', 'id' : 0, 'hash' : 0, 'combo': 1 },

	{'type': 'coverage', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'retreat', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'wingman', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'sniper', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'medic', 'id' : 0, 'hash' : 0, 'combo': 1 },

	{'type': 'retreat', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'reactive', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'reactive', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'reinforce', 'id' : 0, 'hash' : 0, 'combo': 1 },
	{'type': 'reinforce', 'id' : 0, 'hash' : 0, 'combo': 1 },

	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, // 25 Supplies
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 },
	{'type': 'supply', 'id' : 0, 'hash' : 0, 'supply' : 1 }, 

	{'type': 'poppy', 'id' : 0, 'hash' : 0, 'co': 1}, // 2 Commanders
	{'type': 'mo', 'id' : 0, 'hash' : 0, 'co': 1}
];

if (!store.get('deck')) { store.set('deck',deck); }
else { 
	if ( store.get('lastDeck') ) {
		deck = store.get( store.get('lastDeck') );
	} else { deck = store.get( 'deck' ); store.set('lastDeck','deck') }
}