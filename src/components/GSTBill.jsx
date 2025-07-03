'use client'
import React, { useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Font, PDFDownloadLink, Image, pdf } from '@react-pdf/renderer'
import { Button } from './ui/button';
import LoaderButton from './custom/LoaderButton';
import MiniLoaderButton from './custom/MiniLoaderButton';
import { Download } from 'lucide-react';

// Register Inter font
Font.register({
    family: 'Inter',
    fonts: [
        {
            src: '/fonts/Inter-Medium.ttf',
            fontWeight: 500,
        },
        {
            src: '/fonts/Inter-Regular.ttf',
            fontWeight: 400,
        },
        {
            src: '/fonts/Inter-SemiBold.ttf',
            fontWeight: 600,
        },
    ],
})


// Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Inter',
        lineHeight: 1.4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
        alignItems: 'flex-start', // Added for better alignment
    },
    sellerDetails: {
        width: '60%',
    },
    invoiceDetails: {
        width: '40%',
        alignItems: 'flex-end',
    },
    section: {
        marginBottom: 10,
        padding: 5,
    },
    heading: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    subheading: {
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 4,
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 10,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    cell: {
        padding: 5,
        borderRightWidth: 1,
        borderStyle: 'solid',
        textAlign: 'center',
    },
    headerCell: {
        backgroundColor: '#f0f0f0',
        fontWeight: 600,
    },
    bold: {
        fontWeight: 600
    },
    alignRight: {
        textAlign: 'right',
        width: '100%',
        paddingRight: 10,
    },
    summary: {
        marginLeft: 'auto',
        width: '40%',
        marginTop: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 9,
        color: '#555',
    },
    watermark: {
        position: 'absolute',
        top: '50%',
        left: '30%',
        fontSize: 48,
        color: '#f0f0f0',
        transform: 'rotate(-45deg)',
        opacity: 0.3,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 5,
    },
    taxHeaderCell: {
        backgroundColor: '#f0f0f0',
        fontWeight: 600,
        padding: 3,
       flex: 1, // Adjusted width
    },
    taxCell: {
        padding: 3,
        borderRightWidth: 1,
        borderStyle: 'solid',
        flex: 1, // Adjusted width
    },
    taxTotalCell: {
        padding: 3,
        flex: 1, // Adjusted width
        fontWeight: 600,
    }
});

// Number to words conversion
const numberToWords = (num) => {
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if (num === 0) return 'zero';

    let words = '';

    // Crores
    if (Math.floor(num / 10000000) > 0) {
        words += numberToWords(Math.floor(num / 10000000)) + ' crore ';
        num %= 10000000;
    }

    // Lakhs
    if (Math.floor(num / 100000) > 0) {
        words += numberToWords(Math.floor(num / 100000)) + ' lakh ';
        num %= 100000;
    }

    // Thousands
    if (Math.floor(num / 1000) > 0) {
        words += numberToWords(Math.floor(num / 1000)) + ' thousand ';
        num %= 1000;
    }

    // Hundreds
    if (Math.floor(num / 100) > 0) {
        words += numberToWords(Math.floor(num / 100)) + ' hundred ';
        num %= 100;
    }

    // Tens and Units
    if (num > 0) {
        if (words !== '') words += 'and ';

        if (num < 10) {
            words += units[num];
        } else if (num < 20) {
            words += teens[num - 10];
        } else {
            words += tens[Math.floor(num / 10)];
            if (num % 10 > 0) {
                words += ' ' + units[num % 10];
            }
        }
    }

    return words.trim();
};

// GST Bill Component
const GSTBill = ({ data }) => {
    // Calculate exclusive rates and taxes
    const productGstRate = data.items[0].productId.gst || 18;
    const deliveryGstRate = 18;

    // Product calculations
    const productExclusiveRate = data.items[0].price / (1 + productGstRate / 100);
    const productTaxableValue = productExclusiveRate * data.items[0].quantity;
    const productTaxAmount = productTaxableValue * (productGstRate / 100);

    // Delivery calculations
    const deliveryExclusive = data.deliveryCharge / (1 + deliveryGstRate / 100);
    const deliveryTaxAmount = deliveryExclusive * (deliveryGstRate / 100);

    // Totals
    const totalTaxableValue = productTaxableValue + deliveryExclusive;
    const totalTaxAmount = productTaxAmount + deliveryTaxAmount;
    const totalAmount = (totalTaxableValue + totalTaxAmount).toFixed(2);

    // Format dates
    const invoiceDate = new Date(data.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Amount in words
    const amountInWords = numberToWords(Math.floor(totalAmount))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' Rupees Only';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.watermark}>ORIGINAL COPY</Text>

                {/* Header - Fixed layout */}
                <View style={styles.header}>
                    <View style={styles.sellerDetails}>
                        {/* Logo removed */}
                        <Text style={{ ...styles.heading, marginTop: 0 }}>MOBIKING WHOLESALE</Text>
                        <Text>3rd floor B-91 opp.isckon temple east of kailash,</Text>
                        <Text>New Delhi 110065</Text>
                        <Text>Contact: 8587901901 | Email: mobiking507@gmail.com</Text>
                        <Text style={styles.bold}>GSTIN: 07BESPC8834B1ZG</Text>
                    </View>

                    <View style={styles.invoiceDetails}>
                        <Text style={styles.heading}>Tax Invoice</Text>
                        <Text>Invoice No: GST-{data.orderId}</Text>
                        <Text>Date: {invoiceDate}</Text>
                        <Text>State: Delhi</Text>
                        <Text>State Code: 07</Text>
                    </View>
                </View>

                {/* Customer Info */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Bill To:</Text>
                    <Text>{data.name}</Text>
                    <Text>{data.address}</Text>
                    <Text>Contact: {data.phoneNo}</Text>
                    <Text>Email: {data.email}</Text>
                    <Text>State: Madhya Pradesh (State Code: 23)</Text>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={{ ...styles.row, ...styles.headerCell }}>
                        <Text style={{ ...styles.cell, width: '5%' }}>S.No.</Text>
                        <Text style={{ ...styles.cell, width: '45%' }}>DESCRIPTION OF GOODS</Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>HSN/SAC</Text>
                        <Text style={{ ...styles.cell, width: '8%' }}>QTY</Text>
                        <Text style={{ ...styles.cell, width: '12%' }}>RATE (₹)</Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>GST (%)</Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>AMOUNT (₹)</Text>
                    </View>

                    {/* Product Row */}
                    <View style={styles.row}>
                        <Text style={{ ...styles.cell, width: '5%' }}>1</Text>
                        <Text style={{ ...styles.cell, width: '45%', textAlign: 'left' }}>
                            {data.items[0].productId.fullName}
                        </Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>85182100</Text>
                        <Text style={{ ...styles.cell, width: '8%' }}>{data.items[0].quantity}</Text>
                        <Text style={{ ...styles.cell, width: '12%' }}>
                            {productExclusiveRate.toFixed(2)}
                        </Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>{productGstRate}%</Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>
                            {productTaxableValue.toFixed(2)}
                        </Text>
                    </View>

                    {/* Delivery Row */}
                    <View style={styles.row}>
                        <Text style={{ ...styles.cell, width: '5%' }}>2</Text>
                        <Text style={{ ...styles.cell, width: '45%', textAlign: 'left' }}>
                            Delivery Charges
                        </Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>996511</Text>
                        <Text style={{ ...styles.cell, width: '8%' }}></Text>
                        <Text style={{ ...styles.cell, width: '12%' }}>
                            {deliveryExclusive.toFixed(2)}
                        </Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>18%</Text>
                        <Text style={{ ...styles.cell, width: '10%' }}>
                            {deliveryExclusive.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Summary with CGST/SGST split */}
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text>Sub Total:</Text>
                        <Text>₹ {totalTaxableValue.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>CGST:</Text>
                        <Text>₹ {(totalTaxAmount / 2).toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>SGST:</Text>
                        <Text>₹ {(totalTaxAmount / 2).toFixed(2)}</Text>
                    </View>
                    <View style={{ ...styles.summaryRow, borderTopWidth: 1, paddingTop: 5 }}>
                        <Text style={styles.bold}>Total Amount:</Text>
                        <Text style={styles.bold}>₹ {totalAmount}</Text>
                    </View>
                </View>

                {/* Amount in Words */}
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.bold}>Amount in Words:</Text>
                    <Text>{amountInWords}</Text>
                </View>

                {/* Tax Breakdown */}
                <View style={{ marginTop: 15 }}>
                    <Text style={styles.subheading}>Tax Breakdown:</Text>
                    <View style={{ display: 'flex', flexDirection: 'column', borderWidth: 1, marginTop: 5 }}>
                        {/* Table Header */}
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                            <Text style={{ ...styles.taxHeaderCell, width: '16%' }}>HSN/SAC</Text>
                            <Text style={{ ...styles.taxHeaderCell, width: '16%' }}>Taxable Value (₹)</Text>
                            <Text style={{ ...styles.taxHeaderCell, width: '16%' }}>CGST Rate</Text>
                            <Text style={{ ...styles.taxHeaderCell, width: '16%' }}>SGST Rate</Text>
                            <Text style={{ ...styles.taxHeaderCell, width: '16%' }}>CGST Amt (₹)</Text>
                            <Text style={{ ...styles.taxHeaderCell, width: '16%' }}>SGST Amt (₹)</Text>
                        </View>

                        {/* Product Tax */}
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>85182100</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{productTaxableValue.toFixed(2)}</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{productGstRate / 2}%</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{productGstRate / 2}%</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{(productTaxAmount / 2).toFixed(2)}</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{(productTaxAmount / 2).toFixed(2)}</Text>
                        </View>

                        {/* Delivery Tax */}
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>996511</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{deliveryExclusive.toFixed(2)}</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>9%</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>9%</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{(deliveryTaxAmount / 2).toFixed(2)}</Text>
                            <Text style={{ ...styles.taxCell, width: '16%' }}>{(deliveryTaxAmount / 2).toFixed(2)}</Text>
                        </View>

                        {/* Total Tax */}
                        <View style={{ flexDirection: 'row', ...styles.bold }}>
                            <Text style={{ ...styles.taxTotalCell, width: '16%' }}>TOTAL</Text>
                            <Text style={{ ...styles.taxTotalCell, width: '16%' }}>{totalTaxableValue.toFixed(2)}</Text>
                            <Text style={{ ...styles.taxTotalCell, width: '16%' }}>-</Text>
                            <Text style={{ ...styles.taxTotalCell, width: '16%' }}>-</Text>
                            <Text style={{ ...styles.taxTotalCell, width: '16%' }}>{(totalTaxAmount / 2).toFixed(2)}</Text>
                            <Text style={{ ...styles.taxTotalCell, width: '16%' }}>{(totalTaxAmount / 2).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Bank Info */}
                <View style={{ marginTop: 15 }}>
                    <Text style={styles.subheading}>Bank Details:</Text>
                    <Text>Bank Name: HDFC BANK</Text>
                    <Text>Account No.: 50200048030390</Text>
                    <Text>Branch & IFSC: HDFC0000480</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>This is a computer generated invoice and does not require signature</Text>
                    <Text>For MOBIKING WHOLESALE</Text>
                </View>
            </Page>
        </Document>
    )
}

// Exportable PDF Button
const GSTBillDownload = ({ billData }) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = async () => {
        setIsLoading(true)
        try {
            const blob = await pdf(<GSTBill data={billData} />).toBlob()
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `GST_${billData.orderId}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()

            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error generating PDF:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="">
            <MiniLoaderButton
                onClick={handleDownload}
                loading={isLoading}
                variant={'outline'}
            >
               <Download/>
            </MiniLoaderButton>
        </div>
    )
}

export default GSTBillDownload
