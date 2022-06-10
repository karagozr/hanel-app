import React, { useEffect, useState } from 'react';
import { useConstructionActivity, useGuide } from '../../contexts/hooks'
import TreeList, { Column,  SearchPanel, Paging, Scrolling, Toolbar,Item } from 'devextreme-react/tree-list';
import { Button, SelectBox } from 'devextreme-react';
import { ConsActivityDetailModal } from './activity-report-detail-modal';

var currentYear = new Date().getFullYear();

const yearArray = () => {

    let years = [];
    let startYear = 2020;
    while (startYear <= currentYear) {
        years.push(startYear++);
    }

    return years;
};

const monthArray = [
    { value: 1, caption: 'Ocak' },
    { value: 2, caption: 'Şubat' },
    { value: 3, caption: 'Mart' },
    { value: 4, caption: 'Nisan' },
    { value: 5, caption: 'Mayıs' },
    { value: 6, caption: 'Haziran' },
    { value: 7, caption: 'Temmuz' },
    { value: 8, caption: 'Ağustos' },
    { value: 9, caption: 'Eylül' },
    { value: 10, caption: 'EKİM' },
    { value: 11, caption: 'Kasım' },
    { value: 12, caption: 'Aralık' },
]

export const ConsActivityReport = () => {

    const report = useConstructionActivity();
    const guide = useGuide();
    const [filterData, setFilterData] = useState({ currencyCode: "TL", budgetPlanCode: "111"});
    const [dataSource, setDatasource] = useState([]);
    
    const [detailDataSource, setDetailDatasource] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);

    const fetchData = async () => {

        var _resultData = await report.getReport(filterData);
        if (_resultData.data === null) return;


        console.log('*** ', _resultData.data)
        setDatasource(_resultData.data);
    }

    const fetchDetailData = async (filter) => {
        var _resultData = await report.getDetail(filter);
        setDetailDatasource(_resultData.data);
    }

    useEffect(() => {
        fetchData();
    }, [filterData]);


    let maxDisplayProjectTag = window.innerWidth <= 720 ? 2 : (window.innerWidth <= 1000 ? 3 : (window.innerWidth <= 1200 ? 5 : 10))

    const handleTreeCellDblClick = (e) => {

        fetchDetailData({ ...filterData,id:e.data.id});
        setDetailOpen(true);

    }

    const handleDatailPopupClose = () => {
        setDetailOpen(false);
        setDetailDatasource([]);
    }

    return (
        <React.Fragment>
            <ConsActivityDetailModal open={detailOpen} onClose={handleDatailPopupClose} dataSource={detailDataSource} />
            <h3 className={'content-block'}>İnşaat Aktivite Rapor ({filterData.currencyCode})</h3>
            <div className={'content-block dx-card responsive-paddings'} >

                <TreeList
                    id="cash-flow"
                    height={"100%"}
                    dataSource={dataSource}
                    rootValue={'0'}
                    wordWrapEnabled={true}
                    allowColumnResizing={true}
                    allowColumnReordering={false}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    selection={{ mode: 'single' }}
                    keyExpr="id"
                    parentIdExpr="parentId"
                    onCellDblClick={handleTreeCellDblClick}
                >
                    <SearchPanel visible={true} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                    <Column dataField="id" caption="Kod" dataType="string" />
                    <Column dataField="description" caption="Açıklama" dataType="string" />
                    <Column dataField="actual" caption="Gerçekleşen" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column dataField="budget" caption="Bütçe" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    
                    <Toolbar>
                        <Item location="before">
                            <SelectBox id="custom-templates"
                                dataSource={['TL', 'EUR']}
                                onValueChanged={e=>setFilterData({...filterData,currencyCode:e.value})}
                                defaultValue={'EUR'}
                            />
                        </Item>
                        <Item location="before">
                            <Button type={"danger"}  name="filter-report" icon="search" onClick={e=>fetchData()} />
                        </Item>
                    </Toolbar>

                </TreeList>
            </div>

        </React.Fragment>)

}



