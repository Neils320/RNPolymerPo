/*
 * MIT License
 *
 * Copyright (c) 2016 yanbo
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import ActionBar from './../components/ActionBar';
import ItemWeiXinNewsView from './../components/ItemWeiXinNewsView';
import GridView from './../components/GridView'; 
import CommonUtils from './../utils/CommonUtils';
import { fetchWeiXinNewsListByPage } from '../actions/WeiXinNewsAction';
import NavigatorRoute from './../common/NavigatorRoute';

const pageLimit = 10;

class WeiXinNewsPage extends Component {
    static propTypes = {
      navigator: React.PropTypes.object.isRequired,
      route: React.PropTypes.object.isRequired,
    };

	componentDidMount() {
		this.props.dispatch(fetchWeiXinNewsListByPage(1, pageLimit));		
	}

  render() {
      const {weiXinNews} = this.props;
      let listData = weiXinNews.newsList === undefined ? [] : weiXinNews.newsList;
      return (
        <View style={Styles.container}>
            <ActionBar
              title={"微信精选"}
              onIconClicked={this._onIconClicked.bind(this)}/>
            <GridView
              style={Styles.recommandListview}
              items={Array.from(listData)}
              itemsPerRow={2}
              renderItem={this.renderRecommandListItemView.bind(this)}
              onEndReached={ this.onEndReached.bind(this) }
              renderFooter={ this.renderFooterView.bind(this) }
            />
        </View>
      );
  }

  renderRecommandListItemView(template) {
    if (template) {
      return (
        <ItemWeiXinNewsView
          key={template.title}
          bean={template}
          itemClicked={this._templateItemPressed.bind(this, template)}/>
      );
    }
  }

  renderFooterView() {
    const {weiXinNews} = this.props;
    if (weiXinNews.newsList == undefined) {
      return null;
    }
    if (weiXinNews.newsList.length <= 0 || !weiXinNews.haveMore || !weiXinNews.isLoadingMore) {
      return null;
    }
    return (
      <View style={Styles.footerContainer}>
        <ActivityIndicator
          animating ={true}
          size='large'
          color='#f5484c'/>
        <Text style={{fontSize: 16}}>Loading...</Text>
      </View>
    );
  }

  onEndReached() {
    const {weiXinNews} = this.props;
    if (!weiXinNews.isLoadingMore) {
      let start = weiXinNews.newsList.length + 1;
      this.props.dispatch(fetchWeiXinNewsListByPage(start, pageLimit));
    }
  }

  _templateItemPressed(template) {
    NavigatorRoute.pushToWebViewScene(this.props.navigator, 'weixinNews', template);
  }

  _onIconClicked() {
    
  }
}

function mapStateToProps(state) {
  const { weiXinNews } = state;
  return {
    weiXinNews,
  }
}
export default connect(mapStateToProps)(WeiXinNewsPage);

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  recommandListview: {
    flex: 1,
    paddingTop: 8,
  },

  footerContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});