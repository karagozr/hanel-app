import React from "react";
import DataGrid, {
    Column, TotalItem, SearchPanel,
    Paging, Scrolling, Summary
} from 'devextreme-react/data-grid';
import { useHotelData } from '../../../contexts/hooks'
import { leftJoin, addDays } from '../../../helper'

import './hotel-report.css';

const today = new Date();
const defaultDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());


export const HotelIncomeAgentReport = () => {
    const hotel = useHotelData();
    const [hotelData, setHotelData] = React.useState([]);
    const [reportData, setReportData] = React.useState([]);
    const [currDate, setCurrDate] = React.useState(defaultDate)
    const [hotelCapacity, setHotelCapacity] = React.useState(1);

    React.useEffect(() => {
        hotel.getRoomIncomeAgentDailyData().then(({ data }) => {
            if (data === undefined || data === null) return;
            for (var i = 0; i < data.length; i++) {
                data[i].processDate = new Date(data[i].processDate);
            }
            setHotelData(data);
            loadData(defaultDate, data);
        });
        hotel.getHotelCapacity("SundiaFethiyeHotelCapacity")
            .then(({ data }) => {
                setHotelCapacity(data.capacity);
            })
    }, []);

    const loadData = (selectedDate, data) => {
        const tNext1w = addDays(selectedDate, +7);
        const tLast1w = addDays(selectedDate, -7);
        const tLast2w = addDays(selectedDate, -14);

        const totalData = [...data.reduce((r, o) => {
            const key = o.agentId;

            const item = r.get(key) || Object.assign({ agentId: key, agentName: o.agentName }, {
                pax: 0,
                roomSum: 0,
                //occupancy:0,
                incomeSumEUR: 0
            });

            item.pax += o.pax;
            item.roomSum += o.roomSum;
            //item.occupancy = item.roomSum/sumRoom;
            item.incomeSumEUR += o.incomeSumEUR;

            return r.set(key, item);
        }, new Map).values()]

        const tData = [...data.filter(x => x.processDate > tLast1w && x.processDate <= selectedDate).reduce((r, o) => {
            const key = o.agentId;

            const item = r.get(key) || Object.assign({ agentId: key, agentName: o.agentName }, {
                pax: 0,
                roomSum: 0,
                //occupancy:0,
                incomeSumEUR: 0
            });

            item.pax += o.pax;
            item.roomSum += o.roomSum;
            //item.occupancy = item.roomSum/sumRoom;
            item.incomeSumEUR += o.incomeSumEUR;

            return r.set(key, item);
        }, new Map).values()];
        console.table(tData)
        const tNext1wData = [...data.filter(x => x.processDate > selectedDate && x.processDate <= tNext1w).reduce((r, o) => {
            const key = o.agentId;

            const item = r.get(key) || Object.assign({ agentId: key, agentName: o.agentName }, {
                pax: 0,
                roomSum: 0,
                //occupancy:0,
                incomeSumEUR: 0
            });

            item.pax += o.pax;
            item.roomSum += o.roomSum;
            //item.occupancy = item.roomSum/sumRoom;
            item.incomeSumEUR += o.incomeSumEUR;

            return r.set(key, item);
        }, new Map).values()];

        const tAfter1wData = [...data.filter(x => x.processDate > tNext1w).reduce((r, o) => {
            const key = o.agentId;

            const item = r.get(key) || Object.assign({ agentId: key, agentName: o.agentName }, {
                pax: 0,
                roomSum: 0,
                //occupancy:0,
                incomeSumEUR: 0
            });

            item.pax += o.pax;
            item.roomSum += o.roomSum;
            //item.occupancy = item.roomSum/sumRoom;
            item.incomeSumEUR += o.incomeSumEUR;

            return r.set(key, item);
        }, new Map).values()];

        const tLast1wData = [...data.filter(x => x.processDate > tLast2w && x.processDate <= tLast1w).reduce((r, o) => {
            const key = o.agentId;

            const item = r.get(key) || Object.assign({ agentId: key, agentName: o.agentName }, {
                pax: 0,
                roomSum: 0,
                //occupancy:0,
                incomeSumEUR: 0
            });

            item.pax += o.pax;
            item.roomSum += o.roomSum;
            //item.occupancy = item.roomSum/sumRoom;
            item.incomeSumEUR += o.incomeSumEUR;

            return r.set(key, item);
        }, new Map).values()];

        const tBefore1wData = [...data.filter(x => x.processDate <= tLast2w).reduce((r, o) => {
            const key = o.agentId;

            const item = r.get(key) || Object.assign({ agentId: key, agentName: o.agentName }, {
                pax: 0,
                roomSum: 0,
                //occupancy:0,
                incomeSumEUR: 0
            });

            item.pax += o.pax;
            item.roomSum += o.roomSum;
            //item.occupancy = item.roomSum/sumRoom;
            item.incomeSumEUR += o.incomeSumEUR;

            return r.set(key, item);
        }, new Map).values()];


        const arr1 = leftJoin(totalData, tBefore1wData,
            (t1, t2) => t1.agentId === t2.agentId && { ...t1, before1wPax: t2.pax, before1wRoomSum: t2.roomSum, before1wIncomeSumEUR: t2.incomeSumEUR },
            (t1) => ({ ...t1, before1wPax: 0, before1wRoomSum: 0, before1wIncomeSumEUR: 0 }));

        const arr2 = leftJoin(arr1, tLast1wData,
            (t1, t2) => t1.agentId === t2.agentId && { ...t1, last1wPax: t2.pax, last1wRoomSum: t2.roomSum, last1wIncomeSumEUR: t2.incomeSumEUR },
            (t1) => ({ ...t1, last1wPax: 0, last1wRoomSum: 0, last1wIncomeSumEUR: 0 }));

        const arr3 = leftJoin(arr2, tData,
            (t1, t2) => t1.agentId === t2.agentId && { ...t1, tPax: t2.pax, tRoomSum: t2.roomSum, tIncomeSumEUR: t2.incomeSumEUR },
            (t1) => ({ ...t1, tPax: 0, tRoomSum: 0, tIncomeSumEUR: 0 }));

        const arr4 = leftJoin(arr3, tNext1wData,
            (t1, t2) => t1.agentId === t2.agentId && { ...t1, next1wPax: t2.pax, next1wRoomSum: t2.roomSum, next1wIncomeSumEUR: t2.incomeSumEUR },
            (t1) => ({ ...t1, next1wPax: 0, next1wRoomSum: 0, next1wIncomeSumEUR: 0 }));

        const result = leftJoin(arr4, tAfter1wData,
            (t1, t2) => t1.agentId === t2.agentId && { ...t1, after1wPax: t2.pax, after1wRoomSum: t2.roomSum, after1wIncomeSumEUR: t2.incomeSumEUR },
            (t1) => ({ ...t1, after1wPax: 0, after1wRoomSum: 0, after1wIncomeSumEUR: 0 })).sort((a, b) => { return b.incomeSumEUR - a.incomeSumEUR });;

        setReportData(result);
    }

    const onToolbarPreparing = (e) => {
        e.toolbarOptions.items.unshift({
            locateInMenu:"auto",
            location: 'before',
            widget: 'dxDateBox',
            options: {
                value: currDate,
                displayFormat: "dd/MM/yyyy",
                type: "date",
                onValueChanged: (e) => { setCurrDate(e.value); loadData(e.value, hotelData) }
            }
        }, {
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'chevronleft',
                onClick: (e) => { setCurrDate(addDays(currDate, -7)); loadData(addDays(currDate, -7), hotelData) }
            }
        }, {
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'chevronnext',
                onClick: (e) => { setCurrDate(addDays(currDate, +7)); loadData(addDays(currDate, +7), hotelData) }
            }
        });
    }

    const calculateOccupancy = (options) => {
    
        if (options.name === 'occupancySummaryLast') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.totalValue + 100 * (options.value.last1wRoomSum / (hotelCapacity * 7));
            }
        }

        if (options.name === 'occupancySummaryT') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.totalValue + 100 * (options.value.tRoomSum / (hotelCapacity * 7));
            }
        }
        if (options.name === 'occupancySummaryNext') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.totalValue + 100 * (options.value.next1wRoomSum / (hotelCapacity * 7));
            }
        }

        if (options.name === 'occupancySummaryTotal') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.totalValue + 100 * (options.value.roomSum / (hotelCapacity * 365));
            }
        }
    }

    return (<React.Fragment>

        <h3 className={'content-block'}>Acenta Gelir (Konaklama Bazlı)</h3>
        <div className={'content-block dx-card responsive-paddings'} style={{ height: window.innerHeight * 0.84 }}>
            <DataGrid
                className="hotel-agent-report-grid"
                rowAlternationEnabled={true}
                selection={{ mode: 'single', color: 'red' }}
                showBorders={true}
                columnHidingEnabled={true}
                allowColumnResizing={true}
                columnResizingMode={"widget"}
                loadPanel={{enabled:true}}
                columnMinWidth={50}
                columnMaxWidth={150}
                columnAutoWidth={true}
                width={'100%'}
                height={window.innerHeight - (window.innerWidth <= 900 ? 160 : 200)}
                dataSource={reportData}
                onToolbarPreparing={onToolbarPreparing}
            >
                <SearchPanel visible={true} />
                <Scrolling columnRenderingMode="virtual" />
                <Paging enabled={false} />
                <Column key={1}  dataField={'agentName'} caption={'Acenta'} cssClass={"column"} />
                <Column caption={"<  " + addDays(currDate, -14).toLocaleDateString("tr-TR")} alignment="center" >
                    <Column key={10} tabIndex={-1} dataField={'before1wPax'} caption={'Pax'} dataType="number" format='#,##0' />
                    <Column key={11} tabIndex={-1} dataField={'before1wRoomSum'} caption={'Oda'} dataType="number" format='#,##0' cssClass={"column"} />
                    <Column key={12} tabIndex={-1} dataField={'before1wIncomeSumEUR'} caption={'Gelir'} dataType="number" format='#,##0' cssClass={"column"} />
                </Column>
                <Column caption={addDays(currDate, -13).toLocaleDateString("tr-TR") + " - " + addDays(currDate, -7).toLocaleDateString("tr-TR")} alignment="center">
                    <Column key={20} tabIndex={-1} dataField={'last1wPax'} caption={'Pax'} dataType="number" format='#,##0' cssClass={"column"} />
                    <Column key={21} tabIndex={-1} dataField={'last1wRoomSum'} caption={'Oda'} dataType="number" format='#,##0' cssClass={"column"} />
                    <Column key={22} tabIndex={-1} dataField={'last1wIncomeSumEUR'} caption={'Gelir'} dataType="number" format='#,##0' cssClass={"column"} />
                </Column>
                <Column caption={addDays(currDate, -6).toLocaleDateString("tr-TR") + " - " + currDate.toLocaleDateString("tr-TR")} alignment="center" cssClass={"curr-date"}>
                    <Column key={30} tabIndex={-1} dataField={'tPax'} caption={'Pax'} dataType="number" format='#,##0' cssClass={"column curr-date"} />
                    <Column key={31} tabIndex={-1} dataField={'tRoomSum'} caption={'Oda'} dataType="number" format='#,##0' cssClass={"column curr-date"} />
                    <Column key={32} tabIndex={-1} dataField={'tIncomeSumEUR'} caption={'Gelir'} dataType="number" format='#,##0' cssClass={"column curr-date"} />
                </Column>
                <Column caption={addDays(currDate, +1).toLocaleDateString("tr-TR") + " - " + addDays(currDate, +7).toLocaleDateString("tr-TR")} alignment="center">
                    <Column key={40} tabIndex={-1} dataField={'next1wPax'} caption={'Pax'} dataType="number" format='#,##0' cssClass={"column"} />
                    <Column key={41} tabIndex={-1} dataField={'next1wRoomSum'} caption={'Oda'} dataType="number" format='#,##0' cssClass={"column"} />
                    <Column key={42} tabIndex={-1} dataField={'next1wIncomeSumEUR'} caption={'Gelir'} dataType="number" format='#,##0' cssClass={"column"} />
                </Column>
                <Column caption={addDays(currDate, +8).toLocaleDateString("tr-TR") + "  >"} alignment="center">
                    <Column key={50} tabIndex={-1} dataField={'after1wPax'} caption={'Pax'} dataType="number" format='#,##0' cssClass={"column"} />
                    <Column key={51} tabIndex={-1} dataField={'after1wRoomSum'} caption={'Oda'} dataType="number" format='#,##0' cssClass={"column"} />
                    <Column key={52} tabIndex={-1} dataField={'after1wIncomeSumEUR'} caption={'Gelir'} dataType="number" format='#,##0' cssClass={"column"} />
                </Column>
                <Column caption={"Toplam "} alignment="center" cssClass={"total-date"}>
                    <Column key={60} tabIndex={-1} dataField={'pax'} caption={'Pax'} dataType="number" format='#,##0' cssClass={"total-date"} />
                    <Column key={61} tabIndex={-1} dataField={'roomSum'} caption={'Oda'} dataType="number" format='#,##0' cssClass={"total-date"} />
                    <Column key={62} tabIndex={-1} dataField={'incomeSumEUR'} caption={'Gelir'} dataType="number" format='#,##0' cssClass={"total-date"} />
                </Column>
                <Summary calculateCustomSummary={calculateOccupancy}>
                    <TotalItem column="agentName" summaryType="count" displayFormat="{0}" valueFormat="fixedPoint" />
                    <TotalItem column="before1wIncomeSumEUR" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" />
                    <TotalItem column="last1wIncomeSumEUR" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" />
                    <TotalItem column="tIncomeSumEUR" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" cssClass={"curr-date"} />
                    <TotalItem column="next1wIncomeSumEUR" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" />
                    <TotalItem column="after1wIncomeSumEUR" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" />
                    <TotalItem column="incomeSumEUR" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" cssClass={"total-date"} />

                    <TotalItem name="occupancySummaryLast" summaryType="custom" showInColumn="last1wRoomSum" displayFormat="{0}%" valueFormat="fixedPoint" />
                    <TotalItem name="occupancySummaryT" summaryType="custom" showInColumn="tRoomSum" displayFormat="{0}%" valueFormat="fixedPoint" cssClass={"curr-date"}/>
                    <TotalItem name="occupancySummaryNext" summaryType="custom" showInColumn="next1wRoomSum" displayFormat="{0}%" valueFormat="fixedPoint" />

                    <TotalItem name="occupancySummaryTotal" summaryType="custom" showInColumn="roomSum" displayFormat="{0}%" valueFormat="fixedPoint" cssClass={"total-date"}/>

                </Summary>
            </DataGrid>
        </div>
    </React.Fragment>)
}