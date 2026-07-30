import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface Character {
  id: string;
  name: string;
  image: string;
  role: string;
}

const characters: Character[] = [
  {
    id: '1',
    name: 'Albert Einstein',
    image: 'https://api.a0.dev/assets/image?text=realistic%20portrait%20of%20albert%20einstein%20looking%20at%20camera%20with%20a%20slight%20smile&seed=123',
    role: 'Physicist',
  },
  {
    id: '2',
    name: 'Rihanna',
    image: 'https://api.a0.dev/assets/image?text=realistic%20portrait%20of%20rihanna%20looking%20confident%20and%20stylish&seed=456',
    role: 'Artist',
  },
];

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedCharacter) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are ${selectedCharacter.name}. Respond in first person as if you are really them, maintaining their personality, knowledge, and speaking style. Keep responses concise and engaging.`
            },
            {
              role: 'user',
              content: inputText
            }
          ]
        }),
      });

      const data = await response.json();
      
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.completion,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble
      message={item.text}
      isUser={item.isUser}
      timestamp={item.timestamp}
    />
  );

  const selectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setMessages([]);
  };

  const renderCharacter = ({ item }: { item: Character }) => (
    <TouchableOpacity
      style={[
        styles.characterCard,
        selectedCharacter?.id === item.id && styles.selectedCharacter,
      ]}
      onPress={() => selectCharacter(item)}
    >
      <Image source={{ uri: item.image }} style={styles.characterImage} />
      <Text style={styles.characterName}>{item.name}</Text>
      <Text style={styles.characterRole}>{item.role}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!selectedCharacter ? (
        <View style={styles.characterSelection}>
          <Text style={styles.header}>Choose Your Chat Partner</Text>
          <FlatList
            data={characters}
            renderItem={renderCharacter}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.characterList}
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedCharacter(null)}
            >
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedCharacter.image }}
              style={styles.avatarImage}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{selectedCharacter.name}</Text>
              <Text style={styles.headerRole}>{selectedCharacter.role}</Text>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            onLayout={() => flatListRef.current?.scrollToEnd()}
          />

          {isTyping && <TypingIndicator />}

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
                placeholderTextColor="#8E8E93"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={inputText ? '#007AFF' : '#8E8E93'}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  characterSelection: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  characterList: {
    padding: 8,
  },
  characterCard: {
    width: 160,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedCharacter: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  characterRole: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  backButton: {
    padding: 8,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRole: {
    fontSize: 14,
    color: '#666',
  },
});