import { 
  GithubOutlined, 
  WechatOutlined, 
  QqOutlined, 
  UserOutlined, 
  LockTwoTone 
} from '@ant-design/icons';
import { Alert, Checkbox, Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { Link } from 'umi';
import { connect } from 'dva';
import { StateType } from './model';
import styles from './style.less';
import { LoginParamsType } from './service';
// import LoginFrom from './components/Login';
import { aesEncrypt, aesDecrypt } from '@/utils/crypto';

const FormItem = Form.Item;
interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userAndlogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = props => {
  const { userAndlogin = {}, submitting } = props;
  const { status } = userAndlogin;
  const rememberPwd = !!localStorage.getItem('rememberPwd');
  const [remember, setRemember] = useState<boolean>(rememberPwd);
  // const [name, setUserName] = useState<string>('');
  // const [pass, setPassWrod] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    if (remember && username && password) {
      form.setFieldsValue({
        username,
        password: aesDecrypt(password)
      });
    }
  }, [])

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    const { username, password } = values;
    if (remember) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', aesEncrypt(password));
    }
    dispatch({
      type: 'userAndlogin/login',
      payload: {
        ...values,
        password: aesEncrypt(password)
      },
    });
  };
  function onChangeRem(ev: any) {
    setRemember(ev.target.checked);
    if (ev.target.checked) {
      localStorage.setItem('rememberPwd', 'remember');
    } else {
      localStorage.removeItem('rememberPwd')
    }
  }

  return (
    <div className={styles.main}>
      <Form
        form={form}
        // initialValues={{username: name, password: pass}}
        onFinish={values => {
            handleSubmit(values as LoginParamsType);
          }}>
          {status && status !== 200 && !submitting && (
            <LoginMessage content="账户或密码错误" />
          )}
          <FormItem
            name="username"
            rules={[
              {
                required: true,
                message: '校园卡号或者管理员账号!',
              },
            ]}
          >
            <Input 
              placeholder="用户名: 校园卡号或者管理员账号"
              size='large'
              id='username'
              prefix={(
                <UserOutlined
                  style={{
                    color: '#1890ff',
                  }}
                  className={styles.prefixIcon}
                />
              )}
            />
          </FormItem>
          <FormItem
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          >
            <Input 
              placeholder="密码"
              size='large'
              type="password"
              id='password'
              prefix={(
                <LockTwoTone className={styles.prefixIcon} />
              )}
            />
          </FormItem>
        <div>
          <Checkbox checked={remember} onChange={onChangeRem}>
            记住账号密码
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
        <FormItem>
          <Button size="large" className={styles.submit} type="primary" htmlType="submit" loading={submitting}>
            登录
          </Button>
        </FormItem>
        <div className={styles.other}>
          其他登录方式
          <GithubOutlined className={styles.icon} onClick={() => {
            window.open('https://github.com/login/oauth/authorize?client_id=1e5eb6004517470e9a6d&redirect_uri=http://localhost:8000/passport/github/callback');
          }}/>
          <WechatOutlined className={styles.icon} />
          <QqOutlined className={styles.icon} />
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({
    userAndlogin,
    loading,
  }: {
    userAndlogin: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndlogin,
    submitting: loading.effects['userAndlogin/login'], // loading.effects 监听userAndlogin/login 方法请求结束前true结束后为false
  }),
)(Login);
