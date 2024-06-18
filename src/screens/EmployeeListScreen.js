import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';

const EmployeeListScreen = () => {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [division, setDivision] = useState('');
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [error, setError] = useState('');

    const fetchEmployees = () => {
        api.get('/api.php')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error(error);
            }
            );
        setError('');
    };

    useFocusEffect(
        useCallback(() => {
            fetchEmployees();
        }, [])
    );

    const handleAddOrUpdateEmployee = () => {
        if (name.trim() === '' || division.trim() === '') {
            setError('Nama dan Divisi harus diisi.');
            return;
        }

        if (editingEmployee) {
            api.put('/api.php', { id: editingEmployee.id, name, division })
                .then(() => {
                    fetchEmployees();
                    setName('');
                    setDivision('');
                    setEditingEmployee(null);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            api.post('/api.php', { name, division })
                .then(() => {
                    fetchEmployees();
                    setName('');
                    setDivision('');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleEditEmployee = (employee) => {
        setName(employee.name);
        setDivision(employee.division);
        setEditingEmployee(employee);
    };

    const handleDeleteEmployee = (id) => {
        Alert.alert(
            "Konfirmasi",
            "Apakah Anda yakin ingin menghapus karyawan ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    onPress: () => {
                        api.delete('/api.php', { data: { id } })
                            .then(() => {
                                fetchEmployees();
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>List Karyawan</Text>
            <TextInput
                style={styles.input}
                placeholder="Nama"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Divisi"
                value={division}
                onChangeText={setDivision}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button
                title={editingEmployee ? "Update Karyawan" : "Tambah Karyawan"}
                onPress={handleAddOrUpdateEmployee}
            />
            <FlatList
                data={employees}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.employeeContainer}>
                        <Text>{item.name} - {item.division}</Text>
                        <TouchableOpacity onPress={() => handleEditEmployee(item)}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteEmployee(item.id)}>
                            <Text style={styles.deleteButton}>Hapus</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
    },
    employeeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    editButton: {
        color: 'blue',
    },
    deleteButton: {
        color: 'red',
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});

export default EmployeeListScreen;
