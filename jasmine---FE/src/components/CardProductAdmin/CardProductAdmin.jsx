import React, { useState } from 'react';
import { Card, Button, Col, Row, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./CardProductAdmin.css";
import TagPriceComponent from "../TagPriceComponent/TagPriceComponent";

const CardProductAdmin = ({ id, type, img, title, price, onUpdate, onDelete, productId}) => {
  const navigate = useNavigate();

  const handleUpdateClick = () => {
    if (onUpdate) {
      onUpdate(productId); // Call the onUpdate function passed from the parent with productId
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(productId); // Call the onDelete function passed from the parent with productId
    }
  };

  return (
    <Card
      style={{
        width: "29rem", // Set card width
        overflow: "hidden",
        borderRadius: 15,
        margin: "auto",
      }}
      className={type === "primary" ? styles.primary : styles.secondary}
    >
      <Card.Img
        src={img}
        alt={title}
        style={{
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          objectFit: "cover", // Ensure image covers the container
          height: "200px", // Fixed height for image
          width: "100%", // Image takes full width
        }}
      />
      <Card.Body>
        <Card.Title
          style={{
            fontFamily: "Poppins",
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.5,
            textTransform: "capitalize",
            textAlign: "center",
          }}
        >
          {title}
        </Card.Title>
        {type === "secondary" && (
          <Card.Subtitle
            style={{
              color: "#B1E321",
              fontFamily: "Poppins",
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.5,
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {price}
          </Card.Subtitle>
        )}
      </Card.Body>
      {type === "primary" && (
        <div>
          <Row className="align-items-center" style={{ marginBottom: "10px" }}>
            <Col xs={6} className="d-flex">
              <Button
                style={{
                  width: 55,
                  paddingLeft: 20,
                  marginLeft: 10,
                  backgroundColor: "var(--burgundy)",
                  border: "none",
                  borderTopRightRadius: 15,
                  borderBottomLeftRadius: 15,
                  height: 40,
                  marginRight: "5px", // Add margin to create space between buttons
                }}
                onClick={handleUpdateClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path d="M14.6458 9.39583L15.6042 10.3542L6.16667 19.7917H5.20833V18.8333L14.6458 9.39583ZM18.3958 3.125C18.1354 3.125 17.8646 3.22917 17.6667 3.42708L15.7604 5.33333L19.6667 9.23958L21.5729 7.33333C21.6695 7.23696 21.7461 7.1225 21.7984 6.99648C21.8506 6.87047 21.8775 6.73538 21.8775 6.59896C21.8775 6.46253 21.8506 6.32745 21.7984 6.20143C21.7461 6.07542 21.6695 5.96095 21.5729 5.86458L19.1354 3.42708C18.9271 3.21875 18.6667 3.125 18.3958 3.125ZM14.6458 6.44792L3.125 17.9687V21.875H7.03125L18.5521 10.3542L14.6458 6.44792Z" fill="white" />
                </svg>
              </Button>
              <Button
                style={{
                  width: 55,
                  paddingLeft: 20,
                  backgroundColor: "#dc3545", // Red color for delete
                  border: "none",
                  borderTopRightRadius: 15,
                  borderBottomLeftRadius: 15,
                  height: 40,
                }}
                onClick={handleDeleteClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="white" />
                </svg>
              </Button>
            </Col>
            <Col xs={6}>
              <TagPriceComponent style={{ float: "right" }}>
                {price}
              </TagPriceComponent>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
};

export default CardProductAdmin;
