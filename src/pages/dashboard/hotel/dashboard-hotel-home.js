import React from "react";
// import { useHotelData } from '../../../contexts/hooks'
// import ScrollView from 'devextreme-react/scroll-view';
// import './dashboard-hote-agent.css'
// import { TreeChart, RangeSelectorChart } from '../../../components';

import ResponsiveBox, {
  Row,
  Col,
  Item,
  Location
} from 'devextreme-react/responsive-box';
import './dashboard-hotel-home.css'

var now = new Date();
const dateFilter1 = new Date(now.getFullYear(), now.getMonth(), 1);
const dateFilter2 = now.getMonth() === 11 ? new Date(now.getFullYear() + 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);

function screen(width) {
  return (width < 700) ? 'sm' : 'lg';
}

export const HotelDashboardHome = () => {
  

  return (
    <div id="page">
        <ResponsiveBox
          singleColumnScreen="sm"
          screenByWidth={screen}>
          <Row ratio={1}></Row>
          <Row ratio={2} screen="xs"></Row>
          <Row ratio={1}></Row>

          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1}></Col>
          <Col ratio={1} screen="lg"></Col>
          <Col ratio={1}></Col>
          <Item>
            <Location row={0} col={0} colspan={12} screen="lg" />
            <Location row={0} col={0} colspan={6}  screen="sm" />
            <div className="header item">
              <p>Header</p>
            </div>
          </Item>
          <Item>
            <Location row={1} col={0} colspan={3} screen="lg" />
            <Location row={2} col={0} colspan={3} screen="sm" />
            <div className="left-side-bar item">
              <p>ETIKET-1</p>
            </div>
          </Item>
          <Item>
            <Location row={1} col={1} screen="lg" />
            <Location row={1} col={0} screen="sm" />
            <div className="content item">
                <p>ETIKET-2</p>
            </div>
          </Item>
          <Item>
            <Location row={1} col={2} screen="lg" />
            <Location row={2} col={0} screen="sm" ></Location>
            <div className="right-side-bar item">
              <p>Right Bar</p>
            </div>
          </Item>
          <Item>
            <Location row={1} col={3} screen="lg" />
            <Location row={2} col={0} screen="sm" />
            <div className="content item">
              <p>Content</p>
            </div>
          </Item>
          <Item>
            <Location
              row={2}
              col={0}
              colspan={3}
              screen="lg"
            ></Location>
            <Location
              row={3}
              col={0}
              colspan={2}
              screen="sm"
            ></Location>
            <div className="footer item">
              <p>Footer</p>
            </div>
          </Item>
        </ResponsiveBox>
      </div>
  )
}

