import React from "react";
import ResponsiveBox, {
  Row,
  Col,
  Item,
  Location
} from 'devextreme-react/responsive-box';
//import './dashboard-hotel-home.css'

export const HotelHomeDashLayout = (props) => {


  const screen = (width) => {
    return (width < 1200) ? ((width < 700) ? 'sm' : 'md') : 'lg';
  }

  return (<ResponsiveBox singleColumnScreen="xs"
    screenByWidth={screen}>

    <Row ratio={1} screen="sm md lg"></Row>
    <Row ratio={1} screen="sm md lg"></Row>
    <Row ratio={1} screen="sm md lg"></Row>
    <Row ratio={1} screen="sm md lg"></Row>
    <Row ratio={1} screen="sm md"></Row>
    <Row ratio={1} screen="sm"></Row>
    <Row ratio={1} screen="sm"></Row>
    <Row ratio={1} screen="sm"></Row>

    <Col screen="sm md lg"></Col>
    <Col screen="sm md lg"></Col>
    <Col screen="sm md lg"></Col>
    <Col screen="sm md lg"></Col>
    <Col screen="sm md lg"></Col>
    <Col screen="sm md lg"></Col>

    <Col screen="md lg"></Col>
    <Col screen="md lg"></Col>
    <Col screen="md lg"></Col>
    <Col screen="md lg"></Col>
    <Col screen="md lg"></Col>
    <Col screen="md lg"></Col>
    
    <Item>
      <Location row={0} col={0} colspan={12} screen="lg" />
      <Location row={0} col={0} colspan={12} screen="md" />
      <Location row={0} col={0} colspan={6} screen="sm" />
      <div>
        {props.children[0]}
      </div>
    </Item>
    <Item>
      <Location row={1} col={0} colspan={2} screen="lg" />
      <Location row={1} col={0} colspan={2} screen="md" />
      <Location row={1} col={0} colspan={2} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[1]}
      </div>
    </Item>
    <Item>
      <Location row={1} col={2} colspan={2} screen="lg" />
      <Location row={1} col={2} colspan={2} screen="md" />
      <Location row={1} col={2} colspan={2} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[2]}
      </div>
    </Item>
    <Item>
      <Location row={1} col={4} colspan={2} screen="lg" />
      <Location row={1} col={4} colspan={2} screen="md" />
      <Location row={1} col={4} colspan={2} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[3]}
      </div>
    </Item>
    <Item>
      <Location row={1} col={6} colspan={2} screen="lg" />
      <Location row={1} col={6} colspan={2} screen="md" />
      <Location row={2} col={0} colspan={2} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[4]}
      </div>
    </Item>
    <Item>
      <Location row={1} col={8} colspan={2} screen="lg" />
      <Location row={1} col={8} colspan={2} screen="md" />
      <Location row={2} col={2} colspan={2} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[5]}
      </div>
    </Item>
    <Item>
      <Location row={1} col={10} colspan={2} screen="lg" />
      <Location row={1} col={10} colspan={2} screen="md" />
      <Location row={2} col={4} colspan={2} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[6]}
      </div>
    </Item>
    
    {/* <Item>
      <Location row={2} col={0} colspan={4} screen="lg" />
      <Location row={2} col={0} colspan={6} screen="md" />
      <Location row={4} col={0} colspan={6} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[7]}
      </div>
    </Item>
    <Item>
      <Location row={2} col={4} colspan={4} screen="lg" />
      <Location row={2} col={6} colspan={6} screen="md" />
      <Location row={5} col={0} colspan={6} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[8]}
      </div>
    </Item>
    <Item>
      <Location row={2} col={8} colspan={4} screen="lg" />
      <Location row={3} col={0} colspan={12} screen="md" />
      <Location row={6} col={0} colspan={6} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[9]}
      </div>
    </Item> */}
    <Item>
      <Location row={2} col={0} colspan={12} screen="lg" />
      <Location row={2} col={0} colspan={12} screen="md" />
      <Location row={4} col={0} colspan={12} screen="sm" />
      <div style={{alignItems:"center", marginLeft:"5px",marginRight:"5px"}}>
        {props.children[7]}
      </div>
    </Item>
  </ResponsiveBox>)
}