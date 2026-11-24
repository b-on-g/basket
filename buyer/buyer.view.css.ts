namespace $.$$ {

	$mol_style_define( $bog_basket_buyer, {
		flex: {
			basis: '32rem',
			grow: 1,
		},
		Intro: {
			padding: $mol_gap.block,
			font: {
				size: '1.25rem',
			},
		},
		Points: {
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},
		Point: {
			flex: {
				direction: 'column',
			},
			align: {
				items: 'flex-start',
			},
			background: {
				color: $mol_theme.card,
			},
		},
		Point_title: {
			font: {
				weight: 'bold',
			},
		},
		Goods: {
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},
		Good: {
			justify: {
				content: 'space-between',
			},
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
		},
		Good_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},
		Note: {
			padding: $mol_gap.block,
		},
		Refuse: {
			padding: $mol_gap.block,
			color: $mol_theme.shade,
		},
	} )

}
