import React from "react";
import ResponsiveBox, {
  Row,
  Col,
  Item,
  Location
} from 'devextreme-react/responsive-box';
//import './dashboard-hotel-home.css'

export const HotelAgencyMarketDashLayout = (props) => {


  const screen = (width) => {
    return (width < 1200) ? ((width < 700) ? 'sm' : 'md') : 'lg';
  }

  return (<ResponsiveBox singleColumnScreen="xs"
    screenByWidth={screen}>

    <Row ratio={1} screen="sm md lg"></Row>
    <Row ratio={1} screen="sm"></Row>

    <Col screen="sm md lg"></Col>
    <Col screen="md lg"></Col>
    <Item>
      <Location row={0} col={0} colspan={1} screen="lg" />
      <Location row={0} col={0} colspan={1} screen="md" />
      <Location row={0} col={0} colspan={1} screen="sm" />
      <div>
      {props.children[0]}
      </div>
    </Item>
    <Item>
      <Location row={0} col={1} colspan={1} screen="lg" />
      <Location row={0} col={1} colspan={1} screen="md" />
      <Location row={1} col={0} colspan={1} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
      {props.children[1]}
      </div>
    </Item>
  </ResponsiveBox>)
}