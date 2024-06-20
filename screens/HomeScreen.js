import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api';

const HomeScreen = ({ username, logout }) => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [divisionCount, setDivisionCount] = useState({});

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchEmployees = async () => {
                try {
                    const response = await api.get('/api.php');
                    if (isActive) {
                        const employees = response.data;
                        setTotalEmployees(employees.length);

                        const divisionCounts = employees.reduce((acc, employee) => {
                            acc[employee.division] = (acc[employee.division] || 0) + 1;
                            return acc;
                        }, {});
                        setDivisionCount(divisionCounts);
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchEmployees();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleLogout = () => {
        Alert.alert(
            "Konfirmasi Logout",
            "Apakah Anda yakin ingin logout?",
            [
                {
                    text: "Batal",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: logout
                }
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Selamat Datang, {username}</Text>
                <Button title="Logout" onPress={handleLogout} color='red' />
            </View>
            <Text style={styles.subtitle}>Total Karyawan: {totalEmployees}</Text>
            <View style={styles.cardContainer}>
                {Object.keys(divisionCount).map(division => (
                    <View key={division} style={styles.card}>
                        <Text style={styles.cardTitle}>{division}</Text>
                        <Text style={styles.cardCount}>{divisionCount[division]}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    cardContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    cardCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'blue',
    },
});

export default HomeScreen;
