export const umbracoDataTypes = [
  { label: 'Textstring', alias: 'Umbraco.TextBox', group: 'Common' },
  { label: 'Textarea', alias: 'Umbraco.TextArea', group: 'Common' },
  { label: 'Rich Text Editor', alias: 'Umbraco.TinyMCE', group: 'Common' },
  { label: 'Numeric', alias: 'Umbraco.Integer', group: 'Common' },
  { label: 'Decimal', alias: 'Umbraco.Decimal', group: 'Common' },
  { label: 'True/False', alias: 'Umbraco.TrueFalse', group: 'Common' },
  { label: 'Date/Time', alias: 'Umbraco.DateTime', group: 'Common' },
  { label: 'Media Picker (v3)', alias: 'Umbraco.MediaPicker3', group: 'Pickers' },
  { label: 'Multi URL Picker', alias: 'Umbraco.MultiUrlPicker', group: 'Pickers' },
  { label: 'Content Picker', alias: 'Umbraco.ContentPicker', group: 'Pickers' },
  { label: 'Multinode Treepicker', alias: 'Umbraco.MultiNodeTreePicker', group: 'Pickers' },
  { label: 'Block List', alias: 'Umbraco.BlockList', group: 'Lists' },
  { label: 'Block Grid', alias: 'Umbraco.BlockGrid', group: 'Lists' },
  { label: 'Dropdown', alias: 'Umbraco.DropDown.Flexible', group: 'Lists' },
  { label: 'Checkbox List', alias: 'Umbraco.CheckBoxList', group: 'Lists' },
  { label: 'Radio Button List', alias: 'Umbraco.RadioButtonList', group: 'Lists' },
  { label: 'Tags', alias: 'Umbraco.Tags', group: 'Lists' },
  { label: 'Color Picker', alias: 'Umbraco.ColorPicker', group: 'Special' },
  { label: 'Slider', alias: 'Umbraco.Slider', group: 'Special' },
  { label: 'Markdown Editor', alias: 'Umbraco.MarkdownEditor', group: 'Special' }
];

// Helper to get grouped options easily
export const getGroupedDataTypes = () => {
  const groups: { [key: string]: typeof umbracoDataTypes } = {};
  umbracoDataTypes.forEach(type => {
    if (!groups[type.group]) {
      groups[type.group] = [];
    }
    groups[type.group].push(type);
  });
  return groups;
};
