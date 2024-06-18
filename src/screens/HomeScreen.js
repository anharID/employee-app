import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api';

const HomeScreen = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [divisionCount, setDivisionCount] = useState({});

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchEmployees = async () => {
                try {
                    const response = await api.get('/api.php');
                    if (isActive) {
                        console.log("Data fetched successfully", response.data);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selamat Datang</Text>
            <Text>Total Karyawan: {totalEmployees}</Text>
            {Object.keys(divisionCount).map(division => (
                <Text key={division}>{division}: {divisionCount[division]}</Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default HomeScreen;