import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "rgb(128,207,165)",
  },
  title: {
    fontFamily: "Helvetica-Bold",
    paddingTop: "20px",
    color: "white",
    fontSize: "28px",
    textAlign: "center",
  },
  info: {
    fontFamily: "Helvetica-Bold",
    borderRadius: "10px",
    backgroundColor: "white",
    padding: "20px",
    margin: "20px",
    fontSize: "12px",
  },
});

// Create PDF
export default function PrescriptionsPDF({
  patientName,
  diagnosis,
  drugName,
  dose,
  frequency,
  date,
  time,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <Text>{patientName}'s prescription</Text>
        </View>
        <View style={styles.info}>
          <Text>
            Date / Time of prescription: {date}
            {" / "}
            {time}
            {" hrs"}
          </Text>
          <Text>Diagnosis: {diagnosis}</Text>
          <Text>Drug name: {drugName}</Text>
          <Text>Dose: {dose}</Text>
          <Text>Frequency: {frequency}</Text>
          <br></br>
          <Text>
            This prescription is computer generated, no signature required
          </Text>
        </View>
        {/* <View style={styles.table}>
          <View style={styles.tablehead}>
            <View style={styles.tableheadcell}>
              <Text>Year</Text>
            </View>
            <View style={styles.tableheadcell}>
              <Text>Principal Repayment (SGD$)</Text>
            </View>
            <View style={styles.tableheadcell}>
              <Text>Interest Repayment (SGD$)</Text>
            </View>
            <View style={styles.tableheadcell}>
              <Text>Outstanding Balance (SGD$)</Text>
            </View>
          </View>
        </View> */}
      </Page>
    </Document>
  );
}
