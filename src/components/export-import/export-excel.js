import React from 'react';
import PropTypes from 'prop-types';
import ReactExport  from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = ({sheetName,data,columns,buttonRender,fileName}) =>{

    return (
        <React.Fragment>
            <ExcelFile element={buttonRender} filename={fileName}>
                <ExcelSheet data={data} name={sheetName}>
                    {
                        columns.map(({label,value},index)=><ExcelColumn key={index} label={label} value={value}/>)
                    }
                </ExcelSheet>
            </ExcelFile>
        </React.Fragment>
    )
}

ExportExcel.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        label:PropTypes.string.isRequired,
        value:PropTypes.string.isRequired
    })),
    sheetName:PropTypes.string,
    buttonRender:PropTypes.element,
    fileName:PropTypes.string
};

ExportExcel.defaultProps = {
    sheetName:"sheet1",
    buttonRender:(<button>download xlsx</button>),
    fileName:'Hanelapp'
}