import React from "react";
import DataGrid, { Column, Lookup, Paging, Scrolling, Summary, Toolbar, Item, Editing } from 'devextreme-react/data-grid';
import { Button, SelectBox } from 'devextreme-react';
import { useBudget } from '../../../contexts/hooks'

const today = new Date();
const currYear = today.getFullYear();
const minYear = 2019;
const years = () =>{
    var arr = [];
    for (let index = 0; index <= currYear-minYear+1; index++) {
        arr.push(minYear+index)
    }
    return arr;
} 

export const BudgetExchangeRate = (props) => {
    const [filter, setFilter] = React.useState({ year: currYear });
    const [datasource, setDatasource] = React.useState([]);

    const budget = useBudget();

    const fetchData = async () => {
        var _result = await budget.getBudgetExchangeRates(filter);
        setDatasource(_result.data)
    }

    React.useEffect(() => {
        fetchData();
    }, [filter]);

    const handleClickSave = async () =>{
        var _result = await budget.editBudgetExchangeRates(datasource);
    }
    
    return (
        <React.Fragment>
            <div className={"content-block dx-card responsive-paddings"}>
            <h3 className={"content-block"}>Bütçe Döviz Kurları</h3>
            <DataGrid
                className={"budget-edit-exchange-rate-grid"}
                rowAlternationEnabled={true}
                selection={{ mode: 'single', color: 'red' }}
                showBorders={true}
                height={window.innerHeight - 200}
                columnHidingEnabled={true}
                allowColumnResizing={true}
                columnResizingMode={"widget"}
                columnAutoWidth={true}
                width={'100%'}

                dataSource={datasource}
            >
                <Editing allowEditing={true} allowAdding={true} allowDeleting={true} allowUpdating={true} />
                <Scrolling columnRenderingMode="virtual" />
                <Paging enabled={true} />
                <Column tabIndex={-1} dataField={'enable'} caption={'Aktif / Pasif'} dataType="boolean" />
                <Column tabIndex={-1} dataField={'periodDate'} caption={'Periyot / Zaman'} dataType="date" />
                <Column tabIndex={-1} dataField={'currencyCode'} caption={'Seçili Döviz'} dataType="string" allowEditing={true} >
                    <Lookup dataSource={["USD", "EUR", "GBP"]} />
                </Column>
                
                <Column tabIndex={-1} dataField={'exchangeRate'} caption={'Kur Tahmini'} dataType="number" format={{ type: "fixedPoint", precision: 4 }} />


                <Toolbar>


                    <Item location="before">
                        <SelectBox id="custom-templates"

                            dataSource={years()}
                            onValueChanged={(e) => setFilter({ ...filter, year:e.value  })}
                            defaultValue={currYear}
                        />
                    </Item>
                    <Item location="before">
                        <Button icon="save" text="Kaydet" onClick={handleClickSave}></Button>
                    </Item>
                    
                    <Item name="addRowButton" />

                </Toolbar>
            </DataGrid>
        </div>
        </React.Fragment>
    );
};
