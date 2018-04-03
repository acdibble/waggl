import React from 'react';
import { connect } from 'react-redux';
import { Row, List, Icon, Card, Button, message } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { getContacts, getMessages, deleteMessage } from '../actions/messagingActions';


const userStyle = {
  margin: '10px',
  border: '1px #872320 solid',
  backgroundColor: '#ffeded',
  width: '500px',
  float: 'right',
};
const contactStyle = {
  margin: '10px',
  border: '1px #1a4672 solid',
  backgroundColor: '#edf6ff',
  width: '500px',
  float: 'left',
};
const infiniteStyle = {
  border: '1px solid black',
  overflow: 'auto',
  padding: '8px 24px',
  height: '400px',
  width: '80%',
  margin: 'auto',
};

class MessagesTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentContact: null,
      visibleContacts: this.props.contacts.slice(0, 5),
      visibleMessages: [],
      loading: false,
      hasMore: true,
    };
    this.getContacts = this.props.getContacts.bind(this);
    this.getMessages = this.props.getMessages.bind(this);
    this.renderMessageFeed = this.renderMessageFeed.bind(this);
    this.renderContactsList = this.renderContactsList.bind(this);
    this.handleInfiniteMessagesOnLoad = this.handleInfiniteMessagesOnLoad.bind(this);
    this.handleInfiniteContactsOnLoad = this.handleInfiniteContactsOnLoad.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  handleInfiniteMessagesOnLoad() {
    if (this.state.visibleMessages.length >= this.props.messages.length) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.setState({
      visibleMessages: this.props.messages.slice(0, this.state.visibleMessages.length + 5),
      loading: false,
    });
  }

  handleInfiniteContactsOnLoad() {
    this.setState({ loading: true });
    if (this.state.visibleContacts.length >= this.props.contacts.length) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.setState({
      visibleContacts: this.props.contacts.slice(0, this.state.visibleContacts.length + 5),
      loading: false,
    });
  }

  async deleteMessage(e) {
    await deleteMessage(e.target.id, this.props.user.id, e.target.dataset.contact);
  }

  renderContactsList() {
    this.setState({
      currentContact: null,
      visibleContacts: this.props.contacts.slice(0, 5),
    });
  }

  async renderMessageFeed(e) {
    const { name } = e.target.dataset;
    await this.getMessages(this.props.user.id, e.target.id);
    this.setState({
      currentContact: name,
      visibleMessages: this.props.messages.slice(0, 5),
    });
  }


  render() {
    console.log('rendering', this.props, this.state);
    if (this.state.currentContact) {
      if (this.props.messages) {
        return (
          <div>
            <Row>
              <Button onClick={this.renderContactsList} style={{ margin: '10px' }}> <Icon type="left" /> Return to contacts list </Button>
            </Row>
            <Row>
              <div style={infiniteStyle}>
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteMessagesOnLoad}
                  hasMore={!this.state.loading && this.state.hasMore}
                >
                  {
                    this.state.visibleMessages.map(msg => (
                      <Card
                        key={msg.id}
                        style={msg.sender_id === this.props.user.id ? userStyle : contactStyle}
                        title={msg.sender_id === this.props.user.id ?
                          this.props.user.name : this.state.currentContact}
                        extra={
                          <span
                            id={msg.id}
                            data-contact={msg.sender_id === this.props.user.id ?
                              msg.recipient_id : msg.sender_id}
                            style={{ fontSize: 'smaller' }}
                            tabIndex={msg.id}
                            role="button"
                            onClick={this.deleteMessage}
                          >
                            delete message
                          </span>
                      }
                      >
                        <div> {msg.deleted ? 'This message has been deleted.' : msg.message} </div>
                        <div style={{ fontSize: 'smaller' }} > {message.sent} </div>
                      </Card>
                      ))
                  }
                </InfiniteScroll>
              </div>
            </Row>
            <Row>
              <Button onClick={this.renderContactsList} style={{ margin: '10px' }}> <Icon type="left" /> Return to contacts list </Button>
            </Row>
          </div>
        );
      }
      return (<div> Loading... </div>);
    }
    if (this.props.contacts) {
      return (
        <div style={infiniteStyle}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteContactsOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            <List
              itemLayout="horizontal"
              dataSource={this.state.visibleContacts}
              renderItem={contact => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Icon type="mail" />}
                    title={<div id={contact.id} data-name={contact.name} tabIndex={contact.id} role="link" style={{ color: 'green' }} onClick={this.renderMessageFeed}>{contact.name}</div>}
                    description={contact.dogs.join(', ')}
                  />
                </List.Item>)
              }
            />
          </InfiniteScroll>
        </div>
      );
    }
    return (<div> Loading... </div>);
  }
}

const mapStateToProps = ({ fetchContacts, fetchMessages, storeUser }) => ({
  user: storeUser.user,
  contacts: fetchContacts.contacts,
  messages: fetchMessages.messages,
});

const mapDispatchToProps = {
  getContacts,
  getMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesTab);

