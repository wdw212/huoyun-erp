const SNAPSHOT_VALUE_PREFIX = '__snapshot_value__';

const ORDER_SNAPSHOT_FIELD_CONFIG = {
	shipping_company_id: {
		snapshotPath: 'shipping_company_name',
		fallbackLabelPaths: ['shipping_company', 'shipping_company_name'],
		selectDataKey: 'CGS',
		labelKey: 'name',
		valueKey: 'id',
	},
	entered_port_wharf_id: {
		snapshotPath: 'entered_port_wharf_name',
		fallbackLabelPaths: ['entered_port_wharf', 'entered_port_wharf.name', 'entered_port_wharf_name'],
		selectDataKey: 'MT',
		labelKey: 'name',
		valueKey: 'id',
	},
	'order_delegation_header.company_header_id': {
		snapshotPath: 'order_delegation_header.company_header_name',
		fallbackLabelPaths: ['order_delegation_header.company_name', 'order_delegation_header.company_header_name'],
		selectDataKey: 'WTTT',
		labelKey: 'company_name',
		valueKey: 'id',
	},
	origin_harbor_id: {
		snapshotPath: 'origin_harbor.name',
		fallbackLabelPaths: ['origin_harbor.name'],
		selectDataKey: 'GK',
		labelKey: 'name',
		valueKey: 'id',
	},
	destination_harbor_id: {
		snapshotPath: 'destination_harbor.name',
		fallbackLabelPaths: ['destination_harbor.name'],
		selectDataKey: 'GK',
		labelKey: 'name',
		valueKey: 'id',
	},
};

const isEmptyValue = (value) => value === '' || value === null || value === undefined;
const toComparable = (value) => (value === null || value === undefined ? '' : String(value));
const cloneSelectOptions = (options = []) => (
	Array.isArray(options)
		? options.map((option) => (
			option && typeof option === 'object'
				? { ...option }
				: option
		))
		: []
);

const getPathValue = (source, path) => {
	if (!source || !path) return undefined;
	if (Object.prototype.hasOwnProperty.call(source, path)) {
		return source[path];
	}
	return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
};

const setPathValue = (target, path, value) => {
	if (!target || !path) return;
	const keys = path.split('.');
	let current = target;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (current[key] == null || typeof current[key] !== 'object') {
			current[key] = {};
		}
		current = current[key];
	}
	current[keys[keys.length - 1]] = value;
};

const findFormItemByKey = (formList, key) => {
	if (!Array.isArray(formList)) return null;
	for (const tab of formList) {
		const formDataList = tab?.formData;
		if (!Array.isArray(formDataList)) continue;
		for (const formData of formDataList) {
			const formItemList = formData?.formItem;
			if (!Array.isArray(formItemList)) continue;
			for (const formItem of formItemList) {
				if (formItem?.key === key) {
					return formItem;
				}
			}
		}
	}
	return null;
};

const buildSnapshotToken = (fieldKey, originValue) =>
	`${SNAPSHOT_VALUE_PREFIX}${fieldKey}::${toComparable(originValue)}`;

const parseSnapshotTokenOrigin = (rawValue) => {
	if (typeof rawValue !== 'string' || !rawValue.startsWith(SNAPSHOT_VALUE_PREFIX)) {
		return rawValue;
	}
	const separatorIndex = rawValue.lastIndexOf('::');
	if (separatorIndex < 0) return rawValue;
	return rawValue.slice(separatorIndex + 2);
};

export const normalizeSnapshotTokenValue = (rawValue) => parseSnapshotTokenOrigin(rawValue);

export const resetOrderSnapshotState = (state) => {
	if (!state || typeof state !== 'object') return;
	Object.keys(state).forEach((key) => {
		delete state[key];
	});
};

export const normalizeOrderSnapshotValue = (fieldKey, rawValue, state) => {
	const fieldState = state?.[fieldKey];
	if (!fieldState) return rawValue;
	return rawValue === fieldState.snapshotToken ? fieldState.originValue : rawValue;
};

export const trackOrderSnapshotFieldChange = (fieldKey, rawValue, state) => {
	const normalizedValue = normalizeOrderSnapshotValue(fieldKey, rawValue, state);
	const fieldState = state?.[fieldKey];
	if (fieldState && rawValue !== fieldState.snapshotToken) {
		delete state[fieldKey];
	}
	return normalizedValue;
};

export const applyOrderSnapshotDisplay = ({
	formList,
	formData,
	sourceData,
	selectData,
	state,
	fieldKeys = Object.keys(ORDER_SNAPSHOT_FIELD_CONFIG),
}) => {
	if (!formData || !state) return;
	fieldKeys.forEach((fieldKey) => {
		const config = ORDER_SNAPSHOT_FIELD_CONFIG[fieldKey];
		if (!config) return;

		const formItem = findFormItemByKey(formList, fieldKey);
		if (!formItem) {
			delete state[fieldKey];
			return;
		}

		const valueField = formItem.valueName || config.valueKey || 'value';
		const labelField = formItem.labelName || config.labelKey || 'label';
		const latestOptions = cloneSelectOptions(selectData?.[config.selectDataKey]);

		formItem.options = latestOptions;
		const snapshotName = (getPathValue(sourceData, config.snapshotPath) ?? '').toString().trim();
		const fallbackName = (config.fallbackLabelPaths || [])
			.map((path) => (getPathValue(sourceData, path) ?? '').toString().trim())
			.find((name) => !!name);
		const displayName = snapshotName || fallbackName || '';
		const fieldState = state?.[fieldKey];

		const originValue = normalizeOrderSnapshotValue(fieldKey, formData[fieldKey], state);
		if (isEmptyValue(originValue)) {
			if (displayName) {
				const snapshotToken = buildSnapshotToken(fieldKey, '');
				formItem.options = [
					{
						[valueField]: snapshotToken,
						[labelField]: displayName,
						__snapshotOption: true,
						__snapshotWithoutOrigin: true,
					},
					...latestOptions,
				];
				formData[fieldKey] = snapshotToken;
				state[fieldKey] = {
					snapshotToken,
					originValue: '',
				};
				return;
			}
			delete state[fieldKey];
			return;
		}
		const matchedLatest = latestOptions.find((option) => toComparable(option?.[valueField]) === toComparable(originValue));
		if (!snapshotName) {
			if (!matchedLatest) {
				if (fallbackName) {
					formItem.options = [
						{
							[valueField]: originValue,
							[labelField]: fallbackName,
							__fallbackOption: true,
						},
						...latestOptions,
					];
				}
			}
			delete state[fieldKey];
			return;
		}

		const sourceOriginValue = getPathValue(sourceData, fieldKey);
		const currentChangedAfterOpen = !isEmptyValue(originValue) && (
			(!isEmptyValue(sourceOriginValue) && toComparable(originValue) !== toComparable(sourceOriginValue)) ||
			(isEmptyValue(sourceOriginValue) && !fieldState)
		);
		const snapshotOriginValue = !isEmptyValue(sourceOriginValue)
			? sourceOriginValue
			: (fieldState ? fieldState.originValue : '');
		const matchedSnapshotOrigin = latestOptions.find(
			(option) => toComparable(option?.[valueField]) === toComparable(snapshotOriginValue)
		);
		const snapshotToken = buildSnapshotToken(fieldKey, snapshotOriginValue);
		const snapshotOption = {
			...(matchedSnapshotOrigin || {}),
			[valueField]: snapshotToken,
			[labelField]: snapshotName,
			__snapshotOption: true,
		};

		formItem.options = [snapshotOption, ...latestOptions];
		if (currentChangedAfterOpen) {
			delete state[fieldKey];
			return;
		}
		formData[fieldKey] = snapshotToken;
		state[fieldKey] = {
			snapshotToken,
			originValue,
		};
	});
};

export const bindOrderSnapshotSelectVisibleRefresh = ({
	formList,
	getSourceData,
	getSelectData,
	getState,
	refreshers = {},
	fieldKeys = Object.keys(ORDER_SNAPSHOT_FIELD_CONFIG),
}) => {
	if (!Array.isArray(formList)) return;
	fieldKeys.forEach((fieldKey) => {
		const formItem = findFormItemByKey(formList, fieldKey);
		if (!formItem) return;

		const originalVisibleHandler = formItem.__orderSnapshotOriginalVisibleHandler || formItem.onVisibleChange;
		formItem.__orderSnapshotOriginalVisibleHandler = originalVisibleHandler;
		formItem.onVisibleChange = async (visible, item, saveData) => {
			if (typeof originalVisibleHandler === 'function') {
				await originalVisibleHandler(visible, item, saveData);
			}
			if (!visible) return;

			const fieldRefresher = refreshers[fieldKey];
			if (typeof fieldRefresher === 'function') {
				await fieldRefresher();
			}

			const sourceData = typeof getSourceData === 'function' ? getSourceData() : {};
			const selectData = typeof getSelectData === 'function' ? getSelectData() : {};
			const state = typeof getState === 'function' ? getState() : {};
			applyOrderSnapshotDisplay({
				formList,
				formData: saveData,
				sourceData,
				selectData,
				state,
				fieldKeys: [fieldKey],
			});
		};
	});
};

export const normalizeOrderSnapshotSubmitData = (submitData, state) => {
	if (!submitData || !state) return submitData;
	Object.keys(state).forEach((fieldKey) => {
		const fieldState = state[fieldKey];
		if (!fieldState) return;
		const currentValue = getPathValue(submitData, fieldKey);
		if (currentValue === fieldState.snapshotToken) {
			setPathValue(submitData, fieldKey, fieldState.originValue);
		}
	});
	return submitData;
};
