import axios from 'axios';

const TOGGLE_INQUIRY_MODAL = 'TOGGLE_INQUIRY_MODAL';
const GET_CONTACTS = 'GET_CONTACTS';
const GET_MESSAGES = 'GET_MESSAGES';

const toggleInquiryModal = () => (
  {
    type: TOGGLE_INQUIRY_MODAL,
  }
);

const getContacts = async (userId, type) => {
  let someData;
  if (type === 'adopter') {
    someData = await axios.get('/contacts/adopter', { params: { id: userId } });
  } else {
    someData = await axios.get('/contacts/org', { params: { id: userId } });
  }
  return {
    type: GET_CONTACTS,
    someData,
  };
};

const getMessages = async (userId, contactId) => {
  const { data } = await axios.get('/messages/fetch', { params: { userId, contactId } });
  return {
    type: GET_MESSAGES,
    data,
  };
};

const deleteMessage = async (messageId, userId, contactId) => {
  await axios.patch('/messages/delete', { messageId });
  const { data } = await axios.get('/messages/fetch', { params: { userId, contactId } });
  return {
    type: GET_MESSAGES,
    data,
  };
};

const sendMessage = async (senderId, recipientId, recipientType, message) => {
  console.log('action', senderId, recipientId, recipientType, message);
  await axios.post('/messages/post', {
    senderId,
    recipientId,
    message,
    dogName: null,
  });
  const { data } = await axios.get('/messages/fetch', { params: { userId: senderId, contactId: recipientId } });
  return {
    type: GET_MESSAGES,
    data,
  };
};

export {
  TOGGLE_INQUIRY_MODAL,
  toggleInquiryModal,
  GET_CONTACTS,
  getContacts,
  GET_MESSAGES,
  getMessages,
  deleteMessage,
  sendMessage,
};
