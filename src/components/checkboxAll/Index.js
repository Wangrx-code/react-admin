import React, { Component, Fragment } from "react";
import { withRouter } from 'react-router-dom';
// propTypes
import PropTypes from 'prop-types';
// connect
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// action
import { roleMenuAction } from "@/stroe/action/App";
// antd
import { Checkbox } from "antd";
const CheckboxGroup = Checkbox.Group;
// class 组件
class CheckboxAll extends Component {
    constructor(props){
        super(props); // 初始化默认值 
        this.state = {
            checked_default: [],
            checked_length: 0,
            checked_list: [],
            indeterminate: false,
            checkAll: false
        }
    }
    componentDidMount(){
        const checked_list = this.props.data.child_item;
        let checked_value = null;
        if(checked_list && checked_list.length > 0) {
            checked_value = checked_list.map(item => item.value);
        }
        this.setState({
            checked_default: checked_value,
            checked_length: checked_value.length
        })
    }

    updateStateCheckedList = (data) => {
        this.setState({
            ...data
        }, () => {
            this.updateRoleMenu();
        })
    }
    // 单个选项
    onChange = (value) => {
        const { checked_length } = this.state;  // 默认值 
        const length = value.length;            // 勾选的
        
        if(checked_length !== length){          // 部分选中
            this.indeterminateStatus(true);
            this.checkAllStatus(false);
        }
        if(checked_length === length) {         // 全部选中：1、打勾；2、部分选中清除
            this.indeterminateStatus(false);
            this.checkAllStatus(true);
        }
        if(length === 0){
            this.indeterminateStatus(false);
            this.checkAllStatus(false);
        }
        
        this.updateStateCheckedList({
            checked_list: value
        });
    }

    // 部分选择的状态
    indeterminateStatus = (value) => {
        this.setState({ indeterminate: value })
    }
    // 全选按钮的状态
    checkAllStatus = (value) => {
        this.setState({ checkAll: value })
    }

    // 全选、返选
    onCheckAllChange = (e) => {
        const checked = e.target.checked;
        // 全选、返选
        this.updateStateCheckedList({
            checked_list: checked ? this.state.checked_default : []
        })

        this.checkAllStatus(checked);
        this.indeterminateStatus(false);
    }

    /** 
     * 明确最终要作什么东西
     * 1、明确我们开发的东西是什么（复选框组件）
     * 
     * 2、统一数据格式
     * {
     *      user: [
     *          { labeh: "", value: ""},
     *          { labeh: "", value: ""},
     *      ]
     *      dep: ["add", "list"]
     * }
     * 
     * Object.keys()
     * 
     * user: {
     *      "/user/list" : {
     *          label: "用户列表",
     *          value: "/user/list"
     *      }
     * }
     * 
     * 
     **/
    updateRoleMenu = () => {
        // checked_list
        const checked = this.state.checked_list;
        // 第一层
        const first = this.props.data;
        // store
        let StoreChecked = this.props.menu;  // {}
        // 判断是否存在对象
        if(!StoreChecked[first.value]) { StoreChecked[first.value] = {}; }
        // 存储数据
        if(checked.length > 0) {

        }
        // 删除数据
        if(checked.length === 0) {
            delete StoreChecked[first.value];
        }

        console.log(StoreChecked)

        let data = null;

        this.props.actions.roleMenu(data);
        //
    }
   
    render(){
        const { label, value, child_item } = this.props.data;
        const { checked_list, indeterminate, checkAll } = this.state;
        return (
            <Fragment>
                <div class="checkbox-wrap">
                    <div class="all">
                        <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={this.onCheckAllChange}>{label}</Checkbox>
                    </div>
                    <div class="item">
                        <CheckboxGroup options={child_item} value={checked_list} onChange={this.onChange} /><br/><br/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

// 校验数据类型
CheckboxAll.propTypes = {
    data: PropTypes.object,
}
// 默认
CheckboxAll.defaultProps = {
    data: {}
}

const mapStateToProps = (state) => ({
    menu: state.app.role_menu
})

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            roleMenu: roleMenuAction
        }, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(CheckboxAll));