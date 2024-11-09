
// Block & Line Strategy unit testing

/*
	public static void main(String args[])
	{
		ArrayList<Cell> members = new ArrayList<Cell>(9);

		for ( int y = 1, i = 1 ; y <= 3 ; y++ )
		for ( int x = 1 ; x <= 3 ; x++, i++ )
		{
			members.add(new Cell("D" + Integer.toString(i), new Point(x,y+3)));
		}

		Cell c = members.get(0);

		Block block = new Block(members);

		c = members.get(1);
		System.out.println("# Observers : " + Integer.toString(c.countObservers()));

		block.is(1,5);

		System.out.print(block.toString());

		block.is(4, 8);
		block.is(9, 1);
		block.is(8, 3);
		block.is(6, 9);
		block.is(2, 6);
		block.is(7, 4);
		block.is(5, 7);

		System.out.print(block.toString());

		block.reset();
		//	System.out.println(c.toString2());

		// Pointing Line
		System.out.println("");
		System.out.println("# Pointing-Line");
		members = new ArrayList<Cell>(9);

		for ( int x = 4 ; x <= 6 ; x++ )
		{
			members.add(block.cells.get(x-1));
		}

		for ( int x = 4 ; x <= 6 ; x++ )
		{
			members.add(new Cell("E" + Integer.toString(x), new Point(x,1)));
		}

		for ( int x = 4 ; x <= 6 ; x++ )
		{
			members.add(new Cell("F" + Integer.toString(x), new Point(x+3,1)));
		}
		Unit line = new Unit(members);

		ArrayList<Integer> bx = new ArrayList<Integer>(6);
		bx.add(1);bx.add(2);bx.add(3);bx.add(7);bx.add(8);bx.add(9);
		for ( Integer q : bx )
		{
			block.exclude(q, 1);
			block.exclude(q, 7);
		}
		block.exclude(5, 1);
		block.strategy_pointing_line( line, IntersectMap.iB, IntersectMap.iA );

		System.out.println(block.toStringName());
		System.out.println(block.toString());
		System.out.println( line.toStringName());
		System.out.println( line.toString());

		// Box Line
		System.out.println("# Box-Line");
		for ( int i = 4 ; i <= 9 ; i++ )
		{
		//	line.exclude(i, 4);
		//	line.exclude(i, 8);
			line.exclude(i, 9);
		}
		block.strategy_box_line( line, IntersectMap.iB, IntersectMap.iA );

		System.out.println(block.toStringName());
		System.out.println(block.toString());
		System.out.println( line.toStringName());
		System.out.println( line.toString());
	}
*/

// vim: expandtab number tabstop=4
// END
