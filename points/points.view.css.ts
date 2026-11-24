namespace $.$$ {

	$mol_style_define( $bog_basket_points, {
		flex: {
			basis: '32rem',
			grow: 1,
		},
		Hint: {
			padding: $mol_gap.block,
		},
		Rows: {
			gap: $mol_gap.space,
			padding: $mol_gap.block,
		},
		Row: {
			flex: {
				direction: 'column',
			},
			align: {
				items: 'flex-start',
			},
			minHeight: '4.5rem',
			background: {
				color: $mol_theme.card,
			},
		},
		Row_title: {
			font: {
				size: '1.25rem',
				weight: 'bold',
			},
		},
		Row_kits: {
			color: $mol_theme.shade,
		},
	} )

}
