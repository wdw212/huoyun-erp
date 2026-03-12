const SNAPSHOT_VALUE_PREFIX = '__select_snapshot__';

export const snapshotToComparable = (value) => (
	value === null || value === undefined ? '' : String(value)
);

export const isSnapshotEmptyValue = (value) => (
	value === '' || value === null || value === undefined
);

export const buildSelectSnapshotToken = (fieldKey, originValue) => (
	`${SNAPSHOT_VALUE_PREFIX}${fieldKey}::${snapshotToComparable(originValue)}`
);

export const isSelectSnapshotToken = (value) => (
	typeof value === 'string' && value.startsWith(SNAPSHOT_VALUE_PREFIX)
);

export const normalizeSelectSnapshotValue = (value) => {
	if (!isSelectSnapshotToken(value)) {
		return value;
	}
	const separatorIndex = value.lastIndexOf('::');
	if (separatorIndex < 0) {
		return value;
	}
	return value.slice(separatorIndex + 2);
};

export const buildSelectSnapshotOption = ({
	fieldKey,
	originValue,
	snapshotLabel,
	options = [],
	valueKey = 'id',
	labelKey = 'label',
	tagLabel = '历史快照',
}) => {
	const trimmedLabel = (snapshotLabel ?? '').toString().trim();
	const normalizedOriginValue = normalizeSelectSnapshotValue(originValue);
	if (!trimmedLabel || isSnapshotEmptyValue(normalizedOriginValue)) {
		return null;
	}

	const matchedOption = options.find((option) => (
		snapshotToComparable(option?.[valueKey]) === snapshotToComparable(normalizedOriginValue)
	));
	const matchedLabel = (matchedOption?.[labelKey] ?? '').toString().trim();
	if (matchedOption && matchedLabel === trimmedLabel) {
		return null;
	}

	const token = buildSelectSnapshotToken(fieldKey, normalizedOriginValue);
	return {
		token,
		originValue: normalizedOriginValue,
		option: {
			...(matchedOption || {}),
			[valueKey]: token,
			[labelKey]: trimmedLabel,
			__snapshotOption: true,
			__snapshotTagLabel: tagLabel,
		},
	};
};

export const mergeSelectSnapshotOption = ({
	fieldKey,
	originValue,
	snapshotLabel,
	options = [],
	valueKey = 'id',
	labelKey = 'label',
	tagLabel = '历史快照',
}) => {
	const snapshotMeta = buildSelectSnapshotOption({
		fieldKey,
		originValue,
		snapshotLabel,
		options,
		valueKey,
		labelKey,
		tagLabel,
	});
	if (!snapshotMeta) {
		return {
			value: normalizeSelectSnapshotValue(originValue),
			options,
			snapshotMeta: null,
		};
	}

	return {
		value: snapshotMeta.token,
		options: [snapshotMeta.option, ...options],
		snapshotMeta,
	};
};
