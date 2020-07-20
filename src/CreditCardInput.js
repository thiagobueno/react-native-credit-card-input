import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    form: {
        marginTop: 20,
    },
    inputContainer: {
        marginLeft: 10,
    },
    verticalInputContainer: {
        marginHorizontal: 10,
        marginBottom: 20,
    },
    inputLabel: {
        fontWeight: "bold",
    },
    input: {
        height: 40,
    },
});


const CARD_NUMBER_INPUT_WIDTH_OFFSET = 120;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get("window").width - CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = Dimensions.get("window").width - CARD_NUMBER_INPUT_WIDTH_OFFSET;
const CVC_INPUT_WIDTH = ((Dimensions.get("window").width - CARD_NUMBER_INPUT_WIDTH_OFFSET)/2)-10;
const EXPIRY_INPUT_WIDTH = ((Dimensions.get("window").width - CARD_NUMBER_INPUT_WIDTH_OFFSET)/2)-10;
const PREVIOUS_FIELD_OFFSET = 40;

export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,
    verticalInput: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
        name: "NOME (igual no cartão)",
        number: "NÚMERO DO CARTÃO",
        expiry: "VÁLIDADE",
        cvc: "CVV",
    },
    placeholders: {
        name: "NOME COMPLETO",
        number: "1234 5678 1234 5678",
        expiry: "MM/AA",
        cvc: "123",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(nodeHandle,
        e => { throw e; },
        x => {
            scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
            this.refs[field].focus();
    });
  }

  _inputProps = field => {
    const {
        inputStyle, labelStyle, validColor, invalidColor, placeholderColor,
        placeholders, labels, values, status,
        onFocus, onChange, onBecomeEmpty, onBecomeValid,
        additionalInputsProps,
    } = this.props;

    return {
        inputStyle: [s.input, inputStyle],
        labelStyle: [s.inputLabel, labelStyle],
        validColor, invalidColor, placeholderColor,
        ref: field, field,

        label: labels[field],
        placeholder: placeholders[field],
        value: values[field],
        status: status[field],

        onFocus, onChange, onBecomeEmpty, onBecomeValid,

        additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
        cardImageFront, cardImageBack,
        values: { name, number, expiry, cvc, type }, focused, allowScroll,
        cardScale, cardFontFamily, cardBrandIcons, verticalInput
    } = this.props;

    return (
      <View style={s.container}>
        <CreditCard
            focused={focused}
            brand={type}
            scale={cardScale}
            fontFamily={cardFontFamily}
            imageFront={cardImageFront}
            imageBack={cardImageBack}
            customIcons={cardBrandIcons}
            name={name}
            number={number}
            expiry={expiry}
            cvc={cvc} />
        <ScrollView ref="Form"
            horizontal={!verticalInput}
            keyboardShouldPersistTaps="always"
            scrollEnabled={allowScroll}
            showsHorizontalScrollIndicator={false}
            style={s.form}>
            <CCInput {...this._inputProps("name")}
                containerStyle={[verticalInput ? s.verticalInputContainer : s.inputContainer, { width: NAME_INPUT_WIDTH }]} />
            <CCInput {...this._inputProps("number")}
                containerStyle={[verticalInput ? s.verticalInputContainer : s.inputContainer, { width: CARD_NUMBER_INPUT_WIDTH }]} />
            <View style={{flexDirection: 'row'}}>
                <CCInput {...this._inputProps("expiry")}
                    containerStyle={[verticalInput ? s.verticalInputContainer : s.inputContainer, { width: EXPIRY_INPUT_WIDTH }]} />
                <CCInput {...this._inputProps("cvc")}
                    containerStyle={[verticalInput ? s.verticalInputContainer : s.inputContainer, { width: CVC_INPUT_WIDTH }]} />
            </View>
        </ScrollView>
      </View>
    );
  }
}