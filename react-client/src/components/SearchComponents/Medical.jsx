import React from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { updateSearchQuery } from '../../actions/searchActions';

class Medical extends React.Component {
  constructor() {
    super();
    this.state = {
      focused: false,
    };
    this.changesFocusState = this.changesFocusState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  changesFocusState() {
    this.setState({
      focused: !this.state.focused,
    });
  }

  handleChange(value) {
    this.props.updateSearchQuery(value, 'medical');
  }

  render() {
    const { Option } = Select;
    const medical = [
      <Option key="1">Yes</Option>,
      <Option key="0">No</Option>,
    ];
    const selectClassNames =
      this.state.focused
        ? 'select-bar focused'
        : 'select-bar';
    return (
      <Select
        allowClear
        showArrow={false}
        placeholder="No Preference"
        className={selectClassNames}
        onFocus={this.changesFocusState}
        onBlur={this.changesFocusState}
        onChange={this.handleChange}
      >
        {medical}
      </Select>
    );
  }
}

const mapDispatchToProps = {
  updateSearchQuery,
};

export default connect(null, mapDispatchToProps)(Medical);
