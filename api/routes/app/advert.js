/**
 * Created by bingofree.
 */
import _ from 'lodash';
import Router from '@koa/router';
import advertPositionRepos from '../../repository/advert/advert_position_repos';
import advertisementRepos from '../../repository/advert/advertisement_repos';

const router = Router({ prefix: '/advert' });

router.get('/', async (ctx) => {
  ctx.body = '广告相关接口';
});
/**
 * 获取广告位列表
 */
router.post('/get_advert_position_list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;
  let _result = null;

  _result = await advertPositionRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});
/**
 * 获取广告列表
 */
router.get('/get_advert_list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;
  let _result = null;

  _result = await advertisementRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = router;
