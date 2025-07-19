/**
 * Created by bingofree.
 */
import _ from 'lodash';
import Router from '@koa/router';
import formRepos from '../../repository/form/form_repos';

const router = Router({ prefix: '/form' });

router.get('/', async (ctx) => {
  ctx.body = '智能表单相关接口';
});
/**
 * 获取活动商品详情
 */
router.post('/get_form_info', async (ctx) => {
  const { id } = ctx.request.body;
  let _result = null;

  _result = await formRepos.getFormInfo(id);
  ctx.body = _result;
});
/**
 * 提交表单
 */
router.get('/submit_form', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取用户提交表单
 */
router.get('/get_submit_form', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});
/**
 * 获取用户提交订单详情
 */
router.get('/getUserFormSubmitDetial', async (ctx) => {
  let {} = ctx.request.body;
  const _result = null;

  ctx.body = _result;
});

module.exports = router;
