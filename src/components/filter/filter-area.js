import React from "react";

import useCollapse from 'react-collapsed';

import Form, {
    SimpleItem,
    GroupItem,
    Label,
    ButtonItem,
} from 'devextreme-react/form';
import { Accordion, Button, Drawer, TextBox } from "devextreme-react";
import { Item } from "devextreme-react/toolbar";
import { useFilterArea } from "../../contexts";
import _ from "lodash"


export const FilterArea = React.memo( ({ fields, caption, applyFilter, initialData }) => {

    const {setFilterData,filterData} = useFilterArea();
    
    const [data] = React.useState(initialData)

    const screenByWidth = (width) => width < 720 ? 'sm' : 'md';
    const formRef = React.useRef();

   
    
    const handleSetFilter = (e) => {
    
        setFilterData({...filterData,...data});
        if (applyFilter) applyFilter(data);
    }

    return (
        <div className="menu-container">
            {fields && 
            <Form ref={formRef} formData={data} colCount="auto"
                // onFieldDataChanged={e=>setFilter({[e.dataField]:e.value})}
                colCountByScreen={null} minColWidth={180} labelLocation="top"
                screenByWidth={screenByWidth} >
                {

                    fields.map((val, index) => {
                        return (
                            <SimpleItem dataField={val.fieldName} key={index} editorType={val.editorType} editorOptions={val.editorOptions}>
                                <Label text={val.label} />
                            </SimpleItem>
                        )
                    })

                }
                <Item key={1000} cssClass="filter-area-button-group">
                    <Button

                        icon="search"
                        stylingMode="text"
                        type="success"
                        style={{ marginRight: "5px" }}
                        onClick={handleSetFilter} />

                    <Button
                        icon="refresh"
                        stylingMode="text"
                        type="default"
                        style={{ marginRight: "5px" }}
                        onClick={e => setFilterData({ ...initialData })} />
                </Item>



            </Form>}
        </div>
    )

})