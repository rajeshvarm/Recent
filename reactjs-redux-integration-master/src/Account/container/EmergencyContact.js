renderEmergencyContact = (t) => {
    let list = this.props.accountReducer;
    return (
      <div>
        {list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.EMERGENCY_CONTACT]) && this.renderContact()}
        {this.renderAddContact()}
      </div>
    );
  };

  //For Displaying existing contact
  getContactDetails = (contact) => {
    const {t} = this.props
    return (
      <div className="row">
        <div className="columns small-5">
          Image
        </div>
        <div className="columns small-7">
          <p className="collapse">{contact.get('FirstName')} {contact.get('LastName')}</p>
          <p className="collapse">{contact.get('Relationship')}</p>
          <a>{t('account:remove')}</a>
        </div>
      </div>
    )
  }

// If needed to display  more than phone number in the value section can add it here
  getContactPhoneNumber = (contact) =>{
    return(<span>{phoneNumberFormat(contact.get('PhoneNum'))}</span>)
  }

  renderContact = (contact) => {
    const {t} = this.props;
    let list = this.props.accountReducer;
    let contactData = [];
    const emergencyContact = list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.EMERGENCY_CONTACT])
    if(emergencyContact){
    for (let i = 0; i < emergencyContact.size; i++) {
      contactData.push({
        label: this.getContactDetails(emergencyContact.get(i)),
        value: this.getContactPhoneNumber(emergencyContact.get(i)),
        isEdit: true,
        data: list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.EMERGENCY_CONTACT]),
        key: `renderContact`,
      });
    }
    return contactData.map((contactData) => this.renderAccordionContentRow(contactData));
    }
  }

  // renderContactModal = () => {
  //   return <ContactModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  // };

  //For Displaying Add Contact row
  renderAddContact = () => {
    const {t} = this.props;
    let addContact = {
      label: "Image",
      value: t('account:addEmergencyContact'),
      isEdit: true,
     // uiModalComponent: ,
    };
    return this.renderAccordionContentRow(addContact);
  };

  // renderAddContactModal = () => {
  //   return <AddContactModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  // };

