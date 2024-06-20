import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../api';

const EmployeeListScreen = () => {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [division, setDivision] = useState('');
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [error, setError] = useState('');
    const [divisions, setDivisions] = useState(['IT', 'HR', 'Finance', 'Engineering', 'Sales']); // Example divisions

    const fetchEmployees = () => {
        api.get('/api.php')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

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
                    setError('');
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
                    setError('');
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

    const handleCancelEdit = () => {
        setName('');
        setDivision('');
        setEditingEmployee(null);
        setError('');
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
            <View style={styles.card}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.headerText]}>Nama</Text>
                    <Text style={[styles.tableCell, styles.headerText]}>Divisi</Text>
                    <Text style={[styles.tableCell, styles.headerText]}>Aksi</Text>
                </View>
                <FlatList
                    data={employees}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.name}</Text>
                            <Text style={styles.tableCell}>{item.division}</Text>
                            <View style={[styles.tableCell, styles.actionsCell]}>
                                <TouchableOpacity onPress={() => handleEditEmployee(item)} style={styles.iconButton}>
                                    <Icon name="edit" size={20} color="blue" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteEmployee(item.id)} style={styles.iconButton}>
                                    <Icon name="delete" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
            <View style={[styles.card, styles.form]}>
                <TextInput
                    style={styles.input}
                    placeholder="Nama"
                    value={name}
                    onChangeText={setName}
                />
                <Picker
                    selectedValue={division}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDivision(itemValue)}
                >
                    <Picker.Item label="Pilih Divisi" value="" />
                    {divisions.map((division, index) => (
                        <Picker.Item key={index} label={division} value={division} />
                    ))}
                </Picker>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <View style={styles.buttonContainer}>
                    <Button
                        title={editingEmployee ? "Update Karyawan" : "Tambah Karyawan"}
                        onPress={handleAddOrUpdateEmployee}
                        color='blue'
                    />
                    {editingEmployee && (
                        <View style={styles.cancelButton}>
                            <Button
                                title="Batal"
                                onPress={handleCancelEdit}
                                color="red"
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        maxHeight: '60%',
        borderRadius: 8,
        padding: 20,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    form: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
        margin: 0
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
    },
    picker: {
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        marginBottom: 12,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingVertical: 5,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionsCell: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        marginHorizontal: 5,
        paddingHorizontal: 5,
    },
    editButton: {
        color: 'blue',
        marginHorizontal: 2,
    },
    deleteButton: {
        color: 'red',
        marginHorizontal: 2,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
    buttonContainer: {
        marginTop: 10,
    },
    cancelButton: {
        marginTop: 10,
    },
});

export default EmployeeListScreen;
