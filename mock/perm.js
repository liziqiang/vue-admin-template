module.exports = [
  {
    url: '/vue-admin-template/perm/list',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: {
          perms: [
            'Example',
            'Example/Table',
            'Example/Tree',
            'Nested',
            'Nested/Menu1/Menu1-1',
            'Nested/Menu2'
          ]
        }
      }
    }
  }
]
