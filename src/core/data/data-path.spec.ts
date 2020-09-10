import { DataPath } from './data-path';

describe('DataPath', () => {

	it('should set() values correctly', () => {
		const alfa = { A: {  B: 6789 } };
		const beta = { Z: {  X: [ { Y: 5 }, { Y: 10 }, { Y: 15 } ] } };

		DataPath.parse('A.B').set(alfa, 100);
		DataPath.parse('Z.X[0].Y').set(beta, 100);

		expect(alfa.A.B).toEqual(100);
		expect(beta.Z.X[0].Y).toEqual(100);
	});

	it('should get() values correctly', () => {
		const alfa = { A: {  B: 6789 } };
		const beta = { Z: {  X: [ { Y: 5 }, { Y: 10 }, { Y: 15 } ] } };
		const gamma = { Q: 'foo' };

		const v1 = DataPath.parse('A.B').get(alfa);
		const v2 = DataPath.parse('Z.X[1].Y').get(beta);
		const v3 = DataPath.parse('Z.X[2].Y').get(beta);
		const v4 = DataPath.parse('Q').get(gamma);

		expect(v1).toEqual(6789);
		expect(v2).toEqual(10);
		expect(v3).toEqual(15);
		expect(v4).toEqual('foo');
	});

	it('should unshiftItem() value correctly', () => {
		const alfa = { A: [ { B: 1 }, { B: 2 } ] };
		const beta = { A: { B: [] } };

		DataPath.parse('A').unshiftItem(alfa, { B: 3 });
		DataPath.parse('A.B').unshiftItem(beta, { C: 1 });

		expect(alfa.A.length).toEqual(3);
		expect(beta.A.B.length).toEqual(1);
	});

	it('should removeItem() value correctly', () => {
		const alfa = { A: [ { B: 1 }, { B: 2 } ] };
		const beta = { Q: [ { J: 1 }, { J: 2 }, { J: 3 } ] };

		DataPath.parse('A').removeItem(alfa, 0);
		DataPath.parse('Q').removeItem(beta, 2);
		DataPath.parse('Q').removeItem(beta, 1);
		DataPath.parse('Q').removeItem(beta, 0);

		expect(alfa.A.length).toEqual(1);
		expect(alfa.A[0].B).toEqual(2);
		expect(beta.Q.length).toEqual(0);
	});

	it('should moveItem() value correctly', () => {
		const alfa = { A: [ { B: 1000 }, { B: 2000 } ] };

		DataPath.parse('A').moveItem(alfa, 0, 1);

		expect(alfa.A[0].B).toEqual(2000);
		expect(alfa.A[1].B).toEqual(1000);
	});
});
