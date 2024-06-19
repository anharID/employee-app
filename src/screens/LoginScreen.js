import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import api from '../../api';

// Impor gambar logo
import logo from '../../assets/logo.png';

const LoginScreen = ({ setToken, setUsername }) => {
    const [username, setUsernameLocal] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (username.trim() === '' || password.trim() === '') {
            setError('Username dan Password harus diisi.');
            return;
        }

        api.post('/login.php', { username, password })
            .then(async (response) => {
                if (response.data.success) {
                    await setToken(response.data.token);
                    setUsername(username); // Set nama pengguna di sini
                } else {
                    setError('Username atau Password salah.');
                }
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', 'Terjadi kesalahan. Coba lagi nanti.');
            });
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />

            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsernameLocal}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button
                title="Login"
                onPress={handleLogin}
                color='blue'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
});

export default LoginScreen;
