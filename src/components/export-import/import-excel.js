import React from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import PropTypes from 'prop-types';
import './import-excel.css'
import XLSX from 'xlsx'

export const ImportExcel = ({buttonText,setResult,dropZoneElementId,columns}) => {


    const allowedFileExtensions = ['.xls', '.xlsx'];


    const handleFileChange = (e) => {
        

        if (e.value.length === 0) {
            return;
        };
        const file = e.value[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: "array" });
            

            var firstSheet = workbook.SheetNames[0];
            const elements = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
      
            if(columns.length===0){
                setResult(elements);
                return
            }
            
            let result = elements.map((item)=>{
                
                let obj = {}
                let keys = Object.keys(item)
                columns.forEach(col => {
                    if(keys.find(x=>x===col.label)){
                        obj[col.value]=item[keys.find(x=>x===col.label)]
                    }else{
                        obj[col.value]=null
                    }
                });

                return obj
            })


            setResult(result);
        };
        reader.readAsArrayBuffer(file);
    }


    return (
        <React.Fragment>
            <FileUploader
                id="file-uploader"
                selectButtonText="Yükle"
                dialogTrigger={dropZoneElementId}
                dropZone={dropZoneElementId}
                multiple={false}
                allowedFileExtensions={allowedFileExtensions}
                uploadMode="instantly"
                visible={true}
                uploadButtonText={buttonText}
                onValueChanged={handleFileChange}
            ></FileUploader>
        </React.Fragment>
    )
}

ImportExcel.propTypes = {
    setResult: PropTypes.any.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        label:PropTypes.string.isRequired,
        value:PropTypes.string.isRequired
    })),
    dropZoneElementId:PropTypes.string,
    buttonText:PropTypes.string
};

ImportExcel.defaultProps = {
    buttonText:"Yükle",
    columns:[],
    dropZoneElementId:'file-uploader'
}