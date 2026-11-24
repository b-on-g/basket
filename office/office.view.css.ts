namespace $.$$ {

	$mol_style_define( $bog_basket_office, {
		flex: {
			basis: '28rem',
			grow: 1,
		},
		Nav: {
			flex: {
				wrap: 'wrap',
			},
		},
		Total: {
			font: {
				size: '1.25rem',
			},
			padding: $mol_gap.block,
		},
		Goods_rows: {
			flex: {
				grow: 1,
			},
			gap: $mol_gap.block,
		},
		Points_rows: {
			gap: $mol_gap.space,
		},
		Point: {
			flex: {
				direction: 'column',
			},
			align: {
				items: 'stretch',
			},
			background: {
				color: $mol_theme.card,
			},
		},
		Point_note: {
			color: $mol_theme.shade,
		},
		Point_new: {
			padding: $mol_gap.block,
		},
		Point_new_title: {
			flex: {
				grow: 1,
			},
		},
		Csv: {
			margin: $mol_gap.block,
			align: {
				self: 'flex-start',
			},
		},
	} )

}
