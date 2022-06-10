import React from 'react';
import { TabPanel, Item } from 'devextreme-react/tab-panel';
import {AgingReportBranch} from './aging-report-branch'
import {AgingReportProject} from './aging-report-project'
import PropTypes from 'prop-types'

export const AgingMasterDetail = ({filter}) => {
  return (
    <TabPanel>
        <Item title="Şube Bazlı" render={e=>agingReportBranch(filter)} />
        <Item title="Proje Baslı" render={e=>agingReportProject(filter)} />
    </TabPanel>
  )
}

const agingReportBranch = (filter) => {
    return <AgingReportBranch filter={filter}/>;
  }

const agingReportProject = (filter) => {
    return <AgingReportProject filter={filter}/>;
  }

AgingMasterDetail.propTypes = {}