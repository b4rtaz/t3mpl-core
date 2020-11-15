import { CollectionPropertyContract, DataContract, PropertyContract, PropertyContractType } from '../model';

export class DataValidator {

	public validate(dataContract: DataContract, data: any): ValidationErrors {
		const errors: ValidationErrors = {};

		for (const zoneName of Object.keys(dataContract.zones)) {
			const zone = dataContract.zones[zoneName];
			for (const sectionName of Object.keys(zone.sections)) {
				const section = zone.sections[sectionName];
				for (const propertyName of Object.keys(section.properties)) {
					const property = section.properties[propertyName];
					const value = data[zoneName][sectionName][propertyName];
					const dataPath = `${zoneName}.${sectionName}.${propertyName}`;
					this._validateProperty(property, dataPath, value, errors);
				}
			}
		}

		return errors;
	}

	public validateProperty(contract: PropertyContract, dataPath: string, data: any): ValidationErrors {
		const errors = {};
		this._validateProperty(contract, dataPath, data, errors);
		return errors;
	}

	private _validateProperty(contract: PropertyContract, dataPath: string, value: any, errors: ValidationErrors) {
		if (contract.required && (value === null || value === undefined)) {
			errors[dataPath] = 'Value is empty.';
		}

		switch (contract.type) {
			case PropertyContractType.boolean:
			case PropertyContractType.dateTime:
			case PropertyContractType.choice:
			case PropertyContractType.color:
			case PropertyContractType.html:
			case PropertyContractType.markdown:
			case PropertyContractType.image:
			case PropertyContractType.text:
				break;

			case PropertyContractType.collection:
				const items = value as any[];
				const cpc = contract as CollectionPropertyContract;
				if ((cpc.min !== null && items.length < cpc.min) || (cpc.max !== null && items.length > cpc.max)) {
					errors[dataPath] = 'Wrong number of occurrences.';
				}
				for (let i = 0; i < items.length; i++) {
					for (const propertyName of Object.keys(cpc.properties)) {
						const propertyContract = cpc.properties[propertyName];
						const propDataPath = `${dataPath}[${i}].${propertyName}`;
						const itemValue = value[i][propertyName];
						this._validateProperty(propertyContract, propDataPath, itemValue, errors);
					}
				}
				break;

			default:
				throw new Error(`Not supported property contract type ${contract.type}.`);
		}
	}
}

export interface ValidationErrors {
	[dataPath: string]: string;
}
