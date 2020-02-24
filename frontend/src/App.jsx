import React, {Component} from 'react';
//import Material Components
import {Cell, Grid, Row} from '@material/react-layout-grid';
import Select from '@material/react-select';
import MaterialIcon from '@material/react-material-icon';
import Fab from '@material/react-fab';
import TextLoop from 'react-text-loop';
// import {Snackbar} from '@material/react-snackbar';
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from "@material/react-top-app-bar";
import MenuSurface, {Corner} from '@material/react-menu-surface';
//import stylesheet
import './App.scss';
import List, { ListItem, ListItemText } from '@material/react-list';

class SplashBanner extends Component {
  render() {
    return (
      <div className="splashBanner">
        <div className="splashBanner-header">
          <h2 className="splashBanner-logo">Babel</h2>
          <div className="splashBanner-container">
            {/* TODO: Multi-language of the introduction */}
            <div className="splashBanner-greeting">
              <TextLoop
                children={["Hello!", "您好！", "你好！"]}
                noWrap
              ></TextLoop>
            </div >
            <div className="splashBanner-content">
              <TextLoop>
                <span>To get started, <br></br> simply select your language and tap the <MaterialIcon className="inlineIcon" icon="mic" /> to speak.</span>
                <span>请选择语言，<br></br> 轻触 <MaterialIcon className="inlineIcon" icon="mic" /> 即可轻松开始。</span>
                {/* <span>Para comenzar, <br></br> seleccione los idiomas y toque <MaterialIcon className="inlineIcon" icon="mic" /> para hablar.</span> */}
                <span>請揀選語言，<br></br> 輕點 <MaterialIcon className="inlineIcon" icon="mic" /> 即可開始。</span>
                {/* <span>始めるには、<br></br> 言語を選択し、<MaterialIcon className="inlineIcon" icon="mic" /> をタップして話します</span> */}
              </TextLoop>
            </div>
          </div>
        </div>
        <div className="splashBanner-backdrop"></div>
      </div>
    );
  }
}

class AppBar extends Component {
  state = {
    open: false,
    anchorElement: null,
    selectedIndex: 0,
  };

  setAnchorElement = (element) => {
    if (this.state.anchorElement) {
      return;
    }
    this.setState({anchorElement: element});
  }

  handleClick = () => {
    this.setState({open: false})
  }

  render() {
    return (
      <div>
        <TopAppBar className="topAppBar">
          <TopAppBarRow>
            <TopAppBarSection align="start">
              {/* <TopAppBarIcon navIcon tabIndex={0}>
                <MaterialIcon
                  hasRipple
                  icon="menu"
                  onClick={() => this.setState({ open: !this.state.open })}
                />
              </TopAppBarIcon> */}
              <TopAppBarTitle>Babel</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection align="end" role="toolbar">
              <div className='mdc-menu-surface--anchor' ref={this.setAnchorElement}>
                <TopAppBarIcon actionItem tabIndex={0} onClick={() => this.setState({ open: true })}>
                    <MaterialIcon
                      aria-label="language"
                      hasRipple
                      icon="language"
                    />
                </TopAppBarIcon>
                <MenuSurface
                  open={this.state.open}
                  anchorCorner={Corner.BOTTOM_LEFT}
                  onClose={() => this.setState({ open: false })}
                  anchorElement={this.state.anchorElement}
                >
                  <List onClick={this.handleClick} twoLine dense wrapFocus selectedIndex={this.state.selectedIndex} handleSelect={(selectedIndex) => this.setState({selectedIndex})}>
                    <ListItem>
                      <ListItemText primaryText="English (US)" secondaryText="English (US)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primaryText="中文（简体）" secondaryText="Chinese (Simplified)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primaryText="中文（繁體）" secondaryText="Chinese (Traditional)" /> 
                    </ListItem>
                  </List>
                </MenuSurface>
                </div>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust />
      </div>
    );
  }
};

class InputField extends Component {
  render() {
    return (
    <div className="inputField">
      {this.props.value}
    </div>
    );
  }
}

class LangSelect extends Component {

  handleChange = (index, item) => {
    const selectedLanguage = item.getAttribute('data-value')
    this.props.onLanguageChange(selectedLanguage);
  }

  render() {
    const language = this.props.language
    const langOptions = [{
      label: 'Chinese (Mandarin)',
      value: 'mandarin',
    }, {
      label: 'Chinese (Cantonese)',
      value: 'cantonese',
    }, {
      label: 'English (US)',
      value: 'american-english',
    }]
    return (
      <Select
        enhanced
        // outlined
        label="Choose Language"
        value={language}
        onEnhancedChange={this.handleChange}
        options={langOptions}
        className="select-alternate"
      >

      </Select>
    );
  }
}

class SpeakButton extends Component {

  handleClick = () => {
    var data = {
      fromLanguage: this.props.fromLanguage,
      toLanguage: this.props.toLanguage,
      selectOneValue: this.props.selectOneValue,
      selectTwoValue: this.props.selectTwoValue,
    }
    if (data.selectOneValue !== data.selectTwoValue) {
      if (data.fromLanguage && data.toLanguage !== '') {
        if (data.fromLanguage === "zh-CN") {
          this.props.showMsg({
            msg: "请开始说话..."
          });
        } else if (data.fromLanguage === "zh-HK") {
          this.props.showMsg({
            msg: "請開始講話..."
          });
        } else if (data.fromLanguage === "en-US") {
          this.props.showMsg({
            msg: "Speak now..."
          });
        }
        fetch("/translate", {
          method: "POST",
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(
            response => {
              this.props.onResultChange({
                transcribedResult: response[0], //response[0]: transcribed text; response[1]: translated text
                translatedResult: response[1]
              });
            },
            error => {
              console.log("error happened!");
            }
          );
      } else {
        this.props.showMsg({
          msg: 'Please select an input/output language first.'
        })
      }
    } else {
      this.props.showMsg({
        msg: 'Input/Output Language cannot be the same. Please check your selection.'
      })
    }
  }

  render() {
    return (
      <Fab
        onClick={this.handleClick}
        icon={<MaterialIcon icon="mic" />}
        className='fab-alternate'
      ></Fab>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user1_fromLang: "",
      user1_toLang: "",
      user2_fromLang: "",
      user2_toLang: "",
      selectOneValue: "",
      selectTwoValue: "",
      // TODO: the value of these two selecetors should not be the same.
      user1_result: "",
      user2_result: "",
      splashBanner_open: true
    };
  }

  onSelectOne = (value) => {
    this.setState({
      selectOneValue: value,
    })
    if (value === 'mandarin') {
      this.setState({
        user1_fromLang: 'zh-CN',
        user2_toLang: 'zh-Hans',
        user1_result: '轻点麦克风图标即可说话',
      });
    } else if (value === 'cantonese') {
      this.setState({
        user1_fromLang: 'zh-HK',
        user2_toLang: 'yue',
        user1_result: '輕點咪高峰圖標即可講話',
      });
    } else if (value === 'american-english') {
      this.setState({
        user1_fromLang: 'en-US',
        user2_toLang: 'en',
        user1_result: 'Tap mic to talk'
      });
    }
  }

  onSelectTwo = (value) => {
    this.setState({
      selectTwoValue: value,
    })
    if (value === 'mandarin') {
      this.setState({
        user2_fromLang: 'zh-CN',
        user1_toLang: 'zh-Hans',
        user2_result: '轻点麦克风图标即可说话',
      });
    } else if (value === 'cantonese') {
        this.setState({
          user2_fromLang: 'zh-HK',
          user1_toLang: 'yue',
          user2_result: '輕點咪高峰圖標即可講話',
        });
      } else if (value === 'american-english') {
        this.setState({
          user2_fromLang: "en-US",
          user1_toLang: "en",
          user2_result: "Tap mic to talk"
        });
      }
      
  }

  onResultChangeOne = (value) => {
    console.log(value);
    this.setState({
      user1_result: value.transcribedResult,
      user2_result: value.translatedResult,
    })
  }

  onResultChangeTwo = (value) => {
    this.setState({
      user1_result: value.translatedResult,
      user2_result: value.transcribedResult,
    })
  }

  toggleBanner = () => {
    this.setState({splashBanner_open: false})
  }

  render() {
    return (
      <div className="contentContainer">
        <div
          onFocus={() => this.toggleBanner()}
          onBlur={() => this.toggleBanner()}
          tabIndex="0"
        >
          {this.state.splashBanner_open && (<SplashBanner></SplashBanner>)}
        </div>
        {/* <AppBar></AppBar> */}
        <Grid>
          <Row>
            <Cell desktopColumns={6} tabletColumns={12} phoneColumns={12} className="firstUser">
              <div className="resultInput">
                <InputField value={this.state.user1_result} />
              </div>
              <div className="inputContainer">
                <div className="langSelector">
                  <LangSelect
                    onLanguageChange={this.onSelectOne}
                    language={this.state.selectOneValue}
                  />
                </div>
                <div className="speakButton">
                  <SpeakButton
                    showMsg={value => {
                      this.setState({ user1_result: value.msg });
                    }}
                    onResultChange={this.onResultChangeOne}
                    fromLanguage={this.state.user1_fromLang}
                    toLanguage={this.state.user1_toLang}
                    selectOneValue={this.state.selectOneValue}
                    selectTwoValue={this.state.selectTwoValue}
                  />
                </div>
              </div>
            </Cell>
            <Cell desktopColumns={6} tabletColumns={12} phoneColumns={12} className="secondUser">
              <div className="resultInput">
                <InputField value={this.state.user2_result} />
              </div>
              <div className="inputContainer">
                <div className="langSelector">
                  <LangSelect
                    onLanguageChange={this.onSelectTwo}
                    language={this.state.selectTwoValue}
                  />
                </div>
                <div className="speakButton">
                  <SpeakButton
                    showMsg={value => {
                      this.setState({ user2_result: value.msg });
                    }}
                    onResultChange={this.onResultChangeTwo}
                    fromLanguage={this.state.user2_fromLang}
                    toLanguage={this.state.user2_toLang}
                    selectOneValue={this.state.selectOneValue}
                    selectTwoValue={this.state.selectTwoValue}
                  />
                </div>
              </div>
            </Cell>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;