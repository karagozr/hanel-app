import React from "react";
import { useHistory } from "react-router-dom";
import DataGrid, { Column, FilterRow, Paging, Scrolling, Editing, Toolbar, Item } from 'devextreme-react/data-grid';
import { Button, SelectBox } from 'devextreme-react';
import { useBudget } from '../../../contexts/hooks'

const today = new Date();
const currYear = today.getFullYear();
const minYear = 2020;
const years = () =>{
    var arr = [];
    for (let index = 0; index <= currYear-minYear+1; index++) {
        arr.push(minYear+index)
    }
    return arr;
} 

export const BudgetList = () => {
    const refSelectionYear = React.useRef();
    const history = useHistory();
    const budget = useBudget();
    const [selectedYear, setSelectedYear] = React.useState(currYear);
    const [dataSource, setDataSource] = React.useState([]);


    const fetchData = async (_year) => {
        var _resultData = await budget.getBudgetProjectList({ year: _year });
        setDataSource(_resultData.data);
    }

    React.useEffect(() => {
        fetchData(selectedYear);
    }, [selectedYear]);

    React.useEffect(() => {
        fetchData(currYear);
    }, [])

    const handleChangeBudgetYear = (e) =>{
        setSelectedYear(e.value);
    }

    const handleClickBudgetReportAllProject = (_projectCode) =>{
        history.push('/finance/budget/report/' + selectedYear )
    }

    const handleClickBudgetReport = (_projectCode) =>{
        history.push('/finance/budget/report-edit/' + selectedYear + '/' + _projectCode)
    }

    return (
        <React.Fragment>
            <h3 className={'content-block'}>Bütçe Listesi</h3>

            <div className={'content-block dx-card responsive-paddings'}>
                <DataGrid
                    className={"budgetGrid"}
                    rowAlternationEnabled={true}
                    selection={{ mode: 'single', color: 'red' }}
                    showBorders={true}
                    height={parseInt((window.innerHeight - 170))}
                    columnHidingEnabled={true}
                    allowColumnResizing={true}
                    columnResizingMode={"widget"}
                    // columnMinWidth={50}
                    // columnMaxWidth={150}
                    columnAutoWidth={true}
                    width={'100%'}
                    dataSource={dataSource}
                >
                    
                    <Scrolling columnRenderingMode="virtual" />
                    <Column width={220} cellComponent={(e)=>(<Button onClick={(event) => handleClickBudgetReport(e.data.data.projectCode)} type={e.data.data.status?"danger":"success"} stylingMode="text" name="edit" icon="edit" text="Rapor İzle/Düzenle" />)}/>
                       <Column key={1} tabIndex={-1}
                        dataField={'projectGroup'}
                        caption={'Grup'}
                        dataType={'string'}

                        //cssClass={"column"}
                        //cellRender={customCellRender}
                        //width={"auto"}
                        style={{ textAlign: 'right' }}>
                    </Column>
                    <Column tabIndex={-1}
                        dataField={'projectCode'}
                        caption={'Proje Kodu'}
                        dataType={'string'}

                        //cssClass={"column"}
                        //cellRender={customCellRender}
                        //width={"auto"}
                        style={{ textAlign: 'right' }}>
                    </Column>
                    <Column tabIndex={-1}
                        dataField={'projectName'}
                        caption={'Proje Adı'}
                        dataType={'string'}

                        //cssClass={"column"}
                        //cellRender={customCellRender}
                        //width={"auto"}
                        style={{ textAlign: 'right' }}>
                    </Column>

                    
                    <FilterRow visible={true}></FilterRow>

                    {/* <StateStoring enabled={true} type="custom" customLoad={loadCustomGridState} customSave={saveCustomGridState} /> */}


                    <Toolbar>


                        <Item location="before">
                            <SelectBox id="custom-templates"
                                ref={refSelectionYear}
                                dataSource={years()}
                                onValueChanged={handleChangeBudgetYear}
                                defaultValue={currYear}
                            />
                        </Item>

                        <Item location="before">
                            <Button type={"success"} stylingMode="text" name="add-budget-detail" icon="report" text="Tüm Projler" onClick={handleClickBudgetReportAllProject} />
                        </Item>


                    </Toolbar>

                </DataGrid>
            </div>
        </React.Fragment>

    )
}